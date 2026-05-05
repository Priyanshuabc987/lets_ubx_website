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

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1] ?? null;
    const adminUid = await verifyAdmin(token);
    if (!adminUid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { registrationId, fields } = body;

    if (!registrationId || !fields) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

        // Update the private doc only; public docs are disabled.
        const now = admin.firestore.Timestamp ? admin.firestore.Timestamp.now() : new Date();
        const privateRef = adminFirestore.collection('fix_registrations_private').doc(registrationId);

        const privateDoc = await privateRef.get();
        if (!privateDoc.exists) {
          return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
        }

        await privateRef.update({ ...fields, updatedAt: now });

        // Read back the updated document and return a minimal public view
        const updatedSnap = await privateRef.get();
        const data = updatedSnap.data() || {};
        const publicView: any = {
          id: updatedSnap.id,
          name: data.name || '',
          startup_name: data.startup_name || '',
          phone: data.phone || '',
          status: data.status || 'pending',
          allocated_date: data.allocated_date || null,
        };

    return NextResponse.json({ ok: true, registration: publicView });
  } catch (err) {
    console.error('Error in /api/admin/fix/update:', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
