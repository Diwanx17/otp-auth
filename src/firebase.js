/* global firebase */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAxOvxZeLz_UlPXIrTVkHWeeY78ctSLJvw",
  authDomain: "otp-verification-geolocation.firebaseapp.com",
  projectId: "otp-verification-geolocation",
  storageBucket: "otp-verification-geolocation.appspot.com",
  messagingSenderId: "117102041219",
  appId: "1:117102041219:web:6be502aa6ccdb6413f23b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app; // exporting the app, not the entire firebase object
