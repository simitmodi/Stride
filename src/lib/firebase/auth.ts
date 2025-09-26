
"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc } from "firebase/firestore";

export async function signUpWithEmail(
  email: string, 
  password: string, 
  firstName: string,
  lastName: string,
): Promise<User | null> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (userCredential.user) {
    const user = userCredential.user;
    const fullName = `${firstName} ${lastName}`;
    await updateProfile(user, { displayName: fullName });

    // Create user document in Firestore
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      displayName: fullName,
      uid: user.uid,
    });
    
    return user;
  }
  return null;
}

export async function signInWithEmail(email: string, password: string): Promise<User | null> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function signInWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Create user document in Firestore if it's a new user
    const userDocRef = doc(db, "users", user.uid);
    const nameParts = user.displayName?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    await setDoc(userDocRef, {
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      displayName: user.displayName,
      uid: user.uid,
    }, { merge: true }); // Merge to avoid overwriting existing data on login

    return user;
  } catch (error: any) {
    if (error.code !== 'auth/popup-closed-by-user') {
        console.error("Error during Google sign-in:", error);
    }
    return null;
  }
}

export async function signOutUser(): Promise<void> {
  return signOut(auth);
}
