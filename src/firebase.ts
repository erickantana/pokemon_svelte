// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyATAoTnJci9qdE-BT1BMTOeHbF0Tzkey3w',
	authDomain: 'pokemon-f3521.firebaseapp.com',
	projectId: 'pokemon-f3521',
	storageBucket: 'pokemon-f3521.appspot.com',
	messagingSenderId: '137600164108',
	appId: '1:137600164108:web:0e15241de151cadab2e929',
	measurementId: 'G-4971EMD929'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleAuthProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
