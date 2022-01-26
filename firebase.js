import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwI6NxpsZCHUOchFT6gNfct_pZU_H1WdE",
  authDomain: "signal-clone-c44c5.firebaseapp.com",
  projectId: "signal-clone-c44c5",
  storageBucket: "signal-clone-c44c5.appspot.com",
  messagingSenderId: "747887420178",
  appId: "1:747887420178:web:07796e367b7514a07689cb",
};
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// const app = initializeApp(firebaseConfig);
const db = getFirestore();
export { db };
``;
