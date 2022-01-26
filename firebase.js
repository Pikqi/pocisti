import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvh5s3YFhL4EXTtGPbU8u48TFmAuhaw_c",
  authDomain: "pocistiapp.firebaseapp.com",
  projectId: "pocistiapp",
  storageBucket: "pocistiapp.appspot.com",
  messagingSenderId: "499556068359",
  appId: "1:499556068359:web:74ea1923b1cbe954260ea2",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// const app = initializeApp(firebaseConfig);
const db = getFirestore();
export { db };
