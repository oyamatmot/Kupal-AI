import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";

// Log environment variables (for debugging)
console.log("API Key exists:", !!import.meta.env.VITE_FIREBASE_API_KEY);
console.log("Project ID exists:", !!import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log("App ID exists:", !!import.meta.env.VITE_FIREBASE_APP_ID);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "633343686423",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  console.error("Missing required Firebase configuration. Please check your environment variables:", {
    apiKey: !!firebaseConfig.apiKey,
    projectId: !!firebaseConfig.projectId,
    appId: !!firebaseConfig.appId
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    // Force the auth provider to select account every time
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    await signInWithRedirect(auth, provider);
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    if (error.code === 'auth/configuration-not-found') {
      console.error("Firebase Config:", JSON.stringify(firebaseConfig));
      throw new Error("Firebase configuration error. Please verify your Firebase configuration in Secrets.");
    }
    if (error.code === 'auth/unauthorized-domain') {
      const domain = window.location.hostname;
      throw new Error(`Domain ${domain} is not authorized. Add ${domain} to Firebase Console -> Authentication -> Settings -> Authorized domains`);
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