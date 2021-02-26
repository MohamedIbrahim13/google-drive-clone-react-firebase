import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDEVVl0TkNrpQZIHJ1DldDbMX36uMvwbfM",
    authDomain: "mern-app-3a5bb.firebaseapp.com",
    projectId: "mern-app-3a5bb",
    storageBucket: "mern-app-3a5bb.appspot.com",
    messagingSenderId: "734547677535",
    appId: "1:734547677535:web:410b8bcf6eae348c5a26ea"
 };

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const storage = app.storage();
const firestore = app.firestore();

export const db = {
  files: firestore.collection('files'),
  folders: firestore.collection('folders'),
  formatDoc : doc =>{
    return { id:doc.id,...doc.data()}
  },
  currentTimeStamp: firebase.firestore.FieldValue.serverTimestamp
}

export default app