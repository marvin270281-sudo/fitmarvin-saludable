import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configure your Firebase project credentials using environment variables
// (create a .env.local file with the values below; note the `VITE_` prefix for Vite)

/*
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
*/

// Vite exposes env vars on import.meta.env
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// sanity checks for easier debugging
if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
    console.warn('Firebase not configured correctly. Please set VITE_FIREBASE_* vars in .env.local');
}

// don't initialize more than once (hot reload safety)
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
