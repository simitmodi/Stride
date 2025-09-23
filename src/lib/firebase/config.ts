
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, Firestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "studio-5920023951-be7cb",
  "appId": "1:863254815612:web:fec4d4ad644ab284c1faf9",
  "apiKey": "AIzaSyBn6TEkFB8SAi3eL_-yfsGGQMhq2P0gODo",
  "authDomain": "studio-5920023951-be7cb.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "863254815612"
};

let app: FirebaseApp;
let auth: ReturnType<typeof getAuth>;
let db: Firestore;

if (typeof window === 'undefined') {
  // Server-side initialization
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // Client-side initialization
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a time.
      } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
      }
    });
}


export { app, auth, db };
