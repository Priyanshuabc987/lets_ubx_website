
import admin from 'firebase-admin';

// This file is for server-side operations only.

// Prevent re-initialization
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // The private key needs to be parsed correctly from the environment variable.
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  } as admin.ServiceAccount;

  // This will now throw a descriptive error if the environment variables are missing or invalid.
  // This is better than failing silently and causing a downstream crash.
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

}

// Export the initialized admin instance, specifically the Firestore database service.
export const adminDb = admin.firestore();
