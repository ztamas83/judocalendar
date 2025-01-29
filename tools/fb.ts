import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: "../.env" });

const projectId = process.env.VITE_FIREBASE_APP_NAME;
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // Replace with your actual Firebase project configuration
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId: projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: process.env.VITE_FIREBASE_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEAS_ID,
};

export { firebaseConfig };
