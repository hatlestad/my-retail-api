import * as admin from 'firebase-admin';
import dotenv from 'dotenv/config';

import * as serviceAccount from './firebase-key.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL
});

export default admin;