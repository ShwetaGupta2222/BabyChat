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
  apiKey: "AIzaSyB7PuvHu2_YWH4GVhv45gg01REZQ0VQDe0",
  authDomain: "shweta-chat-app-76bda.firebaseapp.com",
  projectId: "shweta-chat-app-76bda",
  storageBucket: "shweta-chat-app-76bda.appspot.com",
  messagingSenderId: "371779753335",
  appId: "1:371779753335:web:a312aaf724a501c6c27d72",
  measurementId: "G-EQS624D6X6"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();