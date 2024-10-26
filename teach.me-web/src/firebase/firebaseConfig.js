import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyCLf-oBLiMpIVYeM3Q3zv5Ob19qCdD11jM",
  authDomain: "teachme-d2815.firebaseapp.com",
  projectId: "teachme-d2815",
  storageBucket: "teachme-d2815.appspot.com", 
  messagingSenderId: "676482642216",
  appId: "1:676482642216:web:9e6e1bbf290bd0e988e01d",
  measurementId: "G-841Y1THXRR"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const storage = getStorage(app); 

export { database, storage };
