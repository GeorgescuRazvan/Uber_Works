import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const messaging = getMessaging(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Cloud Functions URLs
export const cloudFunctions = {
  nearbyTasks: 'https://us-central1-uber-works-461215.cloudfunctions.net/nearbyTasks',
  tasksInBounds: 'https://us-central1-uber-works-461215.cloudfunctions.net/tasksInBounds',
  subscribeToTopic: 'https://us-central1-uber-works-461215.cloudfunctions.net/subscribeToTopic',
  unsubscribeFromTopic: 'https://us-central1-uber-works-461215.cloudfunctions.net/unsubscribeFromTopic',
  getTaskAnalytics: 'https://us-central1-uber-works-461215.cloudfunctions.net/getTaskAnalytics',
  getUserAnalytics: 'https://us-central1-uber-works-461215.cloudfunctions.net/getUserAnalytics',
  logAnalyticsEvent: 'https://us-central1-uber-works-461215.cloudfunctions.net/logAnalyticsEvent'
};

// Google Maps configuration
export const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 