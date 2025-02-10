import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";

// Log environment variables (for debugging)
console.log("Firebase Config Check:", {
  apiKeyExists: !!import.meta.env.VITE_FIREBASE_API_KEY,
  projectIdExists: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appIdExists: !!import.meta.env.VITE_FIREBASE_APP_ID,
  currentDomain: window.location.hostname
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_APP_ID?.split(":")[1] || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate config
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    console.error(`Missing Firebase config: ${key}`);
  }
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    console.log("Starting Google sign-in process");
    // Clear any existing auth state
    await signOut(auth);

    // Force account selection and disable one-tap sign-in
    provider.setCustomParameters({
      prompt: 'select_account',
      auth_type: 'reauthenticate'
    });

    await signInWithRedirect(auth, provider);
    console.log("Sign-in redirect initiated");
  } catch (error: any) {
    console.error("Error in signInWithGoogle:", error);

    // Add detailed error logging
    if (error.code === 'auth/configuration-not-found') {
      console.error("Firebase Config:", {
        ...firebaseConfig,
        apiKey: '[REDACTED]'
      });
      throw new Error("Firebase configuration error. Please verify your Firebase settings and authorized domains.");
    }

    if (error.code === 'auth/unauthorized-domain') {
      const domain = window.location.hostname;
      throw new Error(`Domain ${domain} is not authorized. Please add it to Firebase Console > Authentication > Settings > Authorized domains`);
    }

    throw error;
  }
}

export async function signOutUser() {
  try {
    console.log("Starting sign-out process");
    await signOut(auth);
    console.log("User signed out successfully");
    // Force reload to clear any cached state
    window.location.href = "/";
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Set up auth state listener for debugging
auth.onAuthStateChanged((user) => {
  console.log("Auth state changed:", user ? `User ${user.email} logged in` : "No user");
});

export { auth };