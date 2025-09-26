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
import { auth } from "./config";

export async function signUpWithEmail(
  email: string, 
  password: string, 
  firstName: string,
  lastName: string,
): Promise<User | null> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (userCredential.user) {
    const fullName = `${firstName} ${lastName}`;
    await updateProfile(userCredential.user, { displayName: fullName });
    // No Firestore document creation
    return userCredential.user;
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
    // No Firestore document check or creation
    return userCredential.user;
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
