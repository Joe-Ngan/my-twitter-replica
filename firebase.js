// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCtSHM4JahfW12COGGjIM1w452xnOTz4iw",
    authDomain: "my-twitter-12f1d.firebaseapp.com",
    projectId: "my-twitter-12f1d",
    storageBucket: "my-twitter-12f1d.appspot.com",
    messagingSenderId: "464466866187",
    appId: "1:464466866187:web:cc8d5c47ca91860782d70e"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };