// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqQ_ZzZZnrPwhvOULaf-CR9cLS9LKKbHc",
  authDomain: "inventory-management-72a51.firebaseapp.com",
  projectId: "inventory-management-72a51",
  storageBucket: "inventory-management-72a51.appspot.com",
  messagingSenderId: "420959074923",
  appId: "1:420959074923:web:a61dc19762a3ceb8d5cf2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app) 

export {firestore} // want to be able to access firestore from other files

/*
Things in firebase are ordered into collections and documents.

Collections are like separate databases, like our "inventory" one,
and you can have individual things inside "inventory".
*/



