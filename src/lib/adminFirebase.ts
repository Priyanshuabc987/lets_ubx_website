import admin from 'firebase-admin';

// Initialize admin firebase once
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\\n/g, '\n');

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
