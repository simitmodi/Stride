
"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc, updateDoc } from "firebase/firestore";

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

export async function signOutUser(): Promise<void> {
  return signOut(auth);
}

export async function updateUserProfile(userId: string, data: { [key: string]: any }): Promise<void> {
  const userDocRef = doc(db, "users", userId);
  return await updateDoc(userDocRef, data);
}

    