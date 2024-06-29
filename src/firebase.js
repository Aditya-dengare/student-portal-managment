import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7cPKMH-nSU9ZB9hDDgu4edjzXwFQCjQ8",
  authDomain: "student-management-58df4.firebaseapp.com",
  projectId: "student-management-58df4",
  storageBucket: "student-management-58df4.appspot.com",
  messagingSenderId: "1026448499927",
  appId: "1:1026448499927:web:21aff6a0f6beeb47967c92"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);

export { database, storage }