import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// const firebaseConfig = {
//   apiKey: "AIzaSyDRtzxD0W5oSFur8FTkCyzogiwRutB0Fug",
//   authDomain: "chat-1e80e.firebaseapp.com",
//   projectId: "chat-1e80e",
//   storageBucket: "chat-1e80e.appspot.com",
//   messagingSenderId: "366885059306",
//   appId: "1:366885059306:web:67726eacce7b0af51cb593",
//   measurementId: "G-WVLYH6MSW0"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAdltUBkT4fIpOf1-gPYS-SRqHUYN2kasw",
  authDomain: "chat-ed0e4.firebaseapp.com",
  projectId: "chat-ed0e4",
  storageBucket: "chat-ed0e4.appspot.com",
  messagingSenderId: "233509235952",
  appId: "1:233509235952:web:e52d9d2ad62f1a5e8ca635",
  measurementId: "G-NKDQHRKL3G"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();