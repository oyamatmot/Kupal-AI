
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";

const requiredEnvVars = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing Firebase configuration. Please set these environment variables: ${missingVars.join(", ")}`
  );
}

const firebaseConfig = {
  apiKey: requiredEnvVars.VITE_FIREBASE_API_KEY,
  authDomain: `${requiredEnvVars.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: requiredEnvVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${requiredEnvVars.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: requiredEnvVars.VITE_FIREBASE_PROJECT_ID.split('-')[1] || "",
  appId: requiredEnvVars.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    if (error.code === 'auth/configuration-not-found') {
      throw new Error("Firebase configuration error. Please check your Firebase setup and environment variables.");
    }
    throw error;
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

export { auth };
