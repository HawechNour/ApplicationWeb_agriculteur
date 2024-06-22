import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtahHRB7vWyXUpL8WFaM_C_7vqrECqI8Q",
  authDomain: "agriculture-c7035.firebaseapp.com",
  projectId: "agriculture-c7035",
  storageBucket: "agriculture-c7035.appspot.com",
  messagingSenderId: "950884079549",
  appId: "1:950884079549:web:1c86cf805b2e68d674a4d4"
};


const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app)

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { app, auth , firestore , storage };
