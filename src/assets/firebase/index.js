// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmj9ZYzV_tVr8bisOES0AteiDNRBEYhmQ",
  authDomain: "imaginecupauth.firebaseapp.com",
  projectId: "imaginecupauth",
  storageBucket: "imaginecupauth.appspot.com",
  messagingSenderId: "868522317673",
  appId: "1:868522317673:web:9d80671509368d3a6d8ff8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
 export  { auth , db }
