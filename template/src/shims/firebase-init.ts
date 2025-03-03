// Native builds get the config from google-services.json GoogleService-Info.plist
import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: "AIzaSyBW0LYX4WZ-TUj0h5clHNbYL6U-qXQaAHg",
  authDomain: "fit360-120bb.firebaseapp.com",
  projectId: "fit360-120bb",
  storageBucket: "fit360-120bb.firebasestorage.app",
  messagingSenderId: "575088424012",
  appId: "1:575088424012:web:acc7fd7c152c03ac3ab0e9",
  measurementId: "G-4R1R5N2SLK"
};

const initializeApp = (): void => {
  firebase.initializeApp(firebaseConfig);
};

export default initializeApp;
