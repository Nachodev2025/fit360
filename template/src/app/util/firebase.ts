// Import Firebase compat for web support
import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Platform } from 'react-native';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBW0LYX4WZ-TUj0h5clHNbYL6U-qXQaAHg",
  authDomain: "fit360-120bb.firebaseapp.com",
  projectId: "fit360-120bb",
  storageBucket: "fit360-120bb.firebasestorage.app",
  messagingSenderId: "575088424012",
  appId: "1:575088424012:web:acc7fd7c152c03ac3ab0e9",
  measurementId: "G-4R1R5N2SLK"
};

// Initialize Firebase if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Enable analytics if on web platform
if (Platform.OS === 'web') {
  try {
    firebase.analytics();
  } catch (error) {
    console.log('Firebase analytics is not available in this environment');
  }
}

export default firebase; 