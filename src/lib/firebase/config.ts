
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

// This check prevents re-initializing the app on every render.
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);

export { auth };
