import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase config — these values are intentionally public (security comes from Firebase Rules)
const firebaseConfig = {
  apiKey: 'AIzaSyBWzgcxaDjXsPNDOqbYc3rYQK46clLHSIs',
  authDomain: 'ai-mock-interview-5a19a.firebaseapp.com',
  projectId: 'ai-mock-interview-5a19a',
  storageBucket: 'ai-mock-interview-5a19a.firebasestorage.app',
  messagingSenderId: '1063834827590',
  appId: '1:1063834827590:web:e0e724ae19d074c2e14347',
  measurementId: 'G-HD681HGHQL',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();

// Request additional user info from Google
googleProvider.addScope('profile');
googleProvider.addScope('email');
