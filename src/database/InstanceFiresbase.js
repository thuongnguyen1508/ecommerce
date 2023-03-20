import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDtg6AocZ8SgDlvfp6Y2X4QtC38zHp8Jrk",
    authDomain: "goodsman-1dd35.firebaseapp.com",
    projectId: "goodsman-1dd35",
    storageBucket: "goodsman-1dd35.appspot.com",
    messagingSenderId: "356149107049",
    appId: "1:356149107049:web:9d935466825c16ecc185f8"
};


let _firebaseApp = null
let _firebaseFirestore = null
let _firebaseStorage = null

let firebaseApp = _firebaseApp == null ? (_firebaseApp = initializeApp(firebaseConfig)) : _firebaseApp

let firebaseFirestore = _firebaseFirestore == null ? (_firebaseFirestore = getFirestore(firebaseApp)) : _firebaseFirestore

let firebaseStorage = _firebaseStorage == null ? (_firebaseStorage = getStorage(firebaseApp)) : _firebaseStorage

export { firebaseFirestore, firebaseStorage, firebaseApp };

