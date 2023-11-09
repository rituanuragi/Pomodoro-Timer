import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMqIwPVXJGAgrTSI-e-zb3uYt28YSuj7s",
  authDomain: "pomodoro-auth-9b479.firebaseapp.com",
  projectId: "pomodoro-auth-9b479",
  storageBucket: "pomodoro-auth-9b479.appspot.com",
  messagingSenderId: "283313597419",
  appId: "1:283313597419:web:5b5609ae675ca6c3c307ae"
};

// const googleOAuthClientId = "YOUR_GOOGLE_OAUTH_CLIENT_ID"; // Add this

const fapp = firebase.initializeApp(firebaseConfig);
const googleP = new firebase.auth.GoogleAuthProvider();

export { fapp, googleP, firebase };
