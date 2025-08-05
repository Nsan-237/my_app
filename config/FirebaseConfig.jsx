// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeZibGhOC4L81Up-4aYs0i6iCYztQew74",
  authDomain: "app-4b702.firebaseapp.com",
  projectId: "app-4b702",
  storageBucket: "app-4b702.firebasestorage.app",
  messagingSenderId: "1052834951437",
  appId: "1:1052834951437:web:b921d6b7c8de608e98c044",
  measurementId: "G-CZG9NQY8X8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
// const analytics = getAnalytics(app);