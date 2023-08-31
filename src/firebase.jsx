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
  apiKey: "AIzaSyDIHmrQV7uH_Um9P-g2Dbf8WU4zsvPzuf4",
  authDomain: "chap-app-b93ae.firebaseapp.com",
  projectId: "chap-app-b93ae",
  storageBucket: "chap-app-b93ae.appspot.com",
  messagingSenderId: "1025352855782",
  appId: "1:1025352855782:web:0ab5dc00f11cc27e58cb27",
  measurementId: "G-GDJPV025N0"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();