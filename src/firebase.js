
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAYgcXxmKEZyiK5VyjnZOJ8Ai9zSL7JFPY",
  authDomain: "chat-app-ab5e0.firebaseapp.com",
  projectId: "chat-app-ab5e0",
  storageBucket: "chat-app-ab5e0.appspot.com",
  messagingSenderId: "508139046999",
  appId: "1:508139046999:web:5bcaa2754c1f6150ec7b12",
  measurementId: "G-X7S6BFKHBB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
