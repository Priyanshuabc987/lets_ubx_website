const admin = require('firebase-admin');

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in env');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

async function run() {
  console.log('Listing documents in fix_registrations_public...');
  const snap = await db.collection('fix_registrations_public').listDocuments();
  console.log(`Found ${snap.length} docs. Deleting...`);
  for (const docRef of snap) {
    try {
      await docRef.delete();
      console.log('Deleted', docRef.id);
    } catch (e) {
      console.error('Failed to delete', docRef.id, e);
    }
  }
  console.log('Done.');
}

run().catch((e) => { console.error(e); process.exit(1); });
