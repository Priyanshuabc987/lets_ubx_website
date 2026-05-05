import { NextResponse } from 'next/server';
import admin, { adminFirestore } from '@/lib/adminFirebase';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Create a private document for admin review using admin SDK timestamps
    const now = admin.firestore.Timestamp ? admin.firestore.Timestamp.now() : new Date();
    // Ensure we store a normalized startup name for case-insensitive lookup
    const normalized = (body.startup_name || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
    const ref = await adminFirestore.collection('fix_registrations_private').add({
      ...body,
      startups_normalise: normalized,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });

    // Do NOT create public docs here. Keep all data private in `fix_registrations_private`.

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error('Error in /api/fix/submit:', err);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
