
/**
 * Firebase Admin SDK configuration
 * ---------------------------------
 * Initializes the Firebase Admin SDK so the rest of the app can read and
 * write to Cloud Firestore. Credentials come from the JSON file referenced
 * by GOOGLE_APPLICATION_CREDENTIALS in .env.
 */
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const credFilePath = path.join(
  __dirname,
  '..',
  process.env.GOOGLE_APPLICATION_CREDENTIALS || 'library-secret.json'
);

let serviceAccount;
if (fs.existsSync(credFilePath)) {
  serviceAccount = require(credFilePath);
} else {
  throw new Error(
    'Firebase service account file not found. Please set GOOGLE_APPLICATION_CREDENTIALS ' +
      'in .env to a valid service account JSON path (e.g. library-secret.json).'
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
  });
}

const db = admin.firestore();

const usersCollection = db.collection('users');
const booksCollection = db.collection('books');
const transactionsCollection = db.collection('transactions');

module.exports = {
  admin,
  db,
  usersCollection,
  booksCollection,
  transactionsCollection,
};