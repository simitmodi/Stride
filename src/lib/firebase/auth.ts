
"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";

// This function needs a DOM element to render the reCAPTCHA.
// It's declared here but will be initialized in the component.
export const setupRecaptchaVerifier = (elementId: string): RecaptchaVerifier => {
  if (typeof window !== 'undefined') {
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
    }
    const verifier = new RecaptchaVerifier(auth, elementId, {
      'size': 'invisible',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    (window as any).recaptchaVerifier = verifier;
    return verifier;
  }
  // This should not happen in a client-side context where this is used.
  throw new Error("reCAPTCHA can only be set up in a browser environment.");
};

export const sendPhoneOtp = async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

// This function will be called after the user signs in with a phone number for the first time
// to create a corresponding user document in Firestore.
export const onFirstPhoneSignIn = async (user: User) => {
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const username = `user${user.uid.substring(0, 8)}`;
    await setDoc(userDocRef, {
      uid: user.uid,
      phoneNumber: user.phoneNumber,
      displayName: username,
      username: username,
      role: 'customer',
      createdAt: new Date(),
    });
  }
};


export async function signUpWithEmail(
  email: string, 
  password: string, 
  firstName: string,
  lastName: string,
  username: string,
  dateOfBirth: Date,
): Promise<User | null> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (userCredential.user) {
    const fullName = `${firstName} ${lastName}`;
    await updateProfile(userCredential.user, { displayName: fullName });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: userCredential.user.email,
      uid: userCredential.user.uid,
      displayName: fullName,
      firstName,
      lastName,
      username,
      dateOfBirth,
      role: 'customer' // default role
    });
    return userCredential.user;
  }
  return null;
}

export async function signInWithEmail(email: string, password: string): Promise<User | null> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function getUserByUsername(username: string): Promise<any | null> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return userDoc.data();
  }
  return null;
}

export async function signInWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const displayName = user.displayName || "";
      const emailUsername = user.email?.split('@')[0] || `user${user.uid.substring(0, 5)}`;
      
      let firstName = "";
      let lastName = "";

      if (displayName) {
        const nameParts = displayName.split(" ");
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(" ");
      }

      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        firstName: firstName,
        lastName: lastName,
        username: emailUsername,
        photoURL: user.photoURL,
        role: 'customer',
        createdAt: new Date(),
      });
    }

    return user;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    return null;
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}
