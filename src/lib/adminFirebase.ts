import admin from 'firebase-admin';

function normalizePrivateKey(value?: string) {
  if (!value) return undefined;

  return value
    .replace(/^"|"$/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\\n/g, '\n');
}

// Initialize admin firebase once
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    // Fallback to default creds if available in environment (e.g., GCP)
    try {
      admin.initializeApp();
    } catch (err) {
      // ignore - may already be initialized in some environments
    }
  }
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
export default admin;
