import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!process.env.VITE_FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error("Missing Firebase configuration or private key");
}

// Initialize Firebase Admin with credentials
const app = initializeApp({
  credential: cert({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    clientEmail: `firebase-adminsdk-test@${process.env.VITE_FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  })
});

export const adminAuth = getAuth(app);