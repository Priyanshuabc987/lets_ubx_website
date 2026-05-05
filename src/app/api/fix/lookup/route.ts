import { NextResponse } from 'next/server';
import admin, { adminFirestore } from '@/lib/adminFirebase';

// Simple in-memory rate limiter (per-process). Works for single-instance deployments.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

async function verifyRecaptcha(token?: string) {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) return false; // if not configured, fail-safe to false
  if (!token) return false;

  try {
    const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.error('recaptcha verify error', e);
    return false;
  }
}

function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // apply rate limiting
    const now = Date.now();
    const state = rateLimits.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    if (now > state.resetAt) {
      state.count = 0;
      state.resetAt = now + RATE_LIMIT_WINDOW_MS;
    }
    if (state.count >= RATE_LIMIT_MAX) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const { startup_name, phone, captchaToken } = body || {};

    // require at least startup_name
    if (!startup_name || typeof startup_name !== 'string') {
      return NextResponse.json({ error: 'startup_name is required' }, { status: 400 });
    }

    // verify captcha if configured
    if (process.env.RECAPTCHA_SECRET) {
      const ok = await verifyRecaptcha(captchaToken);
      if (!ok) return NextResponse.json({ error: 'Captcha verification failed' }, { status: 400 });
    }

    // perform lookup in private collection via Admin SDK using normalized field
    const normalized = startup_name.trim().toLowerCase().replace(/\s+/g, ' ');
    let q: any = adminFirestore.collection('fix_registrations_private')
      .where('startups_normalise', '==', normalized)
      .limit(1);

    if (phone && typeof phone === 'string' && phone.trim()) {
      // narrow by phone if provided
      q = q.where('phone', '==', phone.trim());
    }

    const snap = await q.get();
    state.count += 1;
    rateLimits.set(ip, state);

    if (snap.empty) {
      return NextResponse.json({ registration: null });
    }

    const doc = snap.docs[0];
    const data = doc.data() || {};

    // return only minimal fields
    const publicView: any = {
      id: doc.id,
      name: data.name || '',
      startup_name: data.startup_name || '',
      status: data.status || 'pending',
      allocated_date: data.allocated_date || null,
    };

    return NextResponse.json({ registration: publicView });
  } catch (err) {
    console.error('Error in /api/fix/lookup:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
