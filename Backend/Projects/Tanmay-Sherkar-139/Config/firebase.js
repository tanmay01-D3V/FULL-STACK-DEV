
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

// Resolve a relative service-account path against the project root.
const resolveCredRelPath = (p) => {
  if (!p) return null;
  return path.isAbsolute(p) ? p : path.join(__dirname, '..', p);
};

let serviceAccount;

// Prefer the raw JSON injected via env (Render/Heroku/CI where the secret
// file is not committed). Falls back to a local file path.
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT is set but is not valid JSON. Paste the full ' +
      'contents of your service-account .json file into the env var.'
    );
  }
} else {
  const credFilePath = resolveCredRelPath(
    process.env.GOOGLE_APPLICATION_CREDENTIALS || 'library-secret.json'
  );
  if (credFilePath && fs.existsSync(credFilePath)) {
    serviceAccount = require(credFilePath);
  } else {
    throw new Error(
      'Firebase service account not found. Set GOOGLE_APPLICATION_CREDENTIALS to a ' +
        'valid service-account JSON file path, or define the FIREBASE_SERVICE_ACCOUNT ' +
        'env var with the raw JSON (recommended for Render/Heroku, where the secret ' +
        'file is not deployed).'
    );
  }
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