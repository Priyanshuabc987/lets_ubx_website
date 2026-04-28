
import admin from 'firebase-admin';

// This file is for server-side operations only.

function normalizePrivateKey(value?: string) {
  if (!value) return undefined;

  // Support both `.env` styles:
  // 1. literal "\n" sequences
  // 2. real multiline PEM values
  return value
    .replace(/^"|"$/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\\n/g, '\n');
}

// Prevent re-initialization
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin environment variables.');
  }

  const serviceAccount = {
    projectId,
    clientEmail,
    privateKey,
  } as admin.ServiceAccount;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export the initialized admin instance, specifically the Firestore database service.
export const adminDb = admin.firestore();
