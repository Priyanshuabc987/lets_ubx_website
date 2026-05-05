import { NextResponse } from 'next/server';
import admin, { adminAuth, adminFirestore } from '@/lib/adminFirebase';

async function verifyAdmin(token?: string | null) {
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;
    const userDoc = await adminFirestore.collection('users').doc(uid).get();
    const roles = userDoc.exists ? userDoc.data()?.roles || [] : [];
    if (Array.isArray(roles) && roles.includes('admin')) return uid;
  } catch (err) {
    console.error('Admin token verify error', err);
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1] ?? null;
    const adminUid = await verifyAdmin(token);
    if (!adminUid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const snap = await adminFirestore.collection('fix_registrations_private').orderBy('createdAt', 'desc').get();
    const items: any[] = [];
    snap.forEach((doc) => {
      items.push({ id: doc.id, ...(doc.data() as any) });
    });

    return NextResponse.json({ data: items });
  } catch (err) {
    console.error('Error in /api/admin/fix/list:', err);
    return NextResponse.json({ error: 'Failed to list' }, { status: 500 });
  }
}
