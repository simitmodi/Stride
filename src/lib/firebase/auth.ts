
"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./config";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export async function signUpWithEmail(
  email: string, 
  password: string, 
  firstName: string,
  lastName: string,
  username: string,
  dateOfBirth: Date
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
      username: username,
      dateOfBirth: dateOfBirth,
      email: user.email,
      displayName: fullName,
      uid: user.uid,
    });
    
    // Send verification email
    await sendEmailVerification(user);

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

export async function sendVerificationEmail(): Promise<void> {
  const user = auth.currentUser;
  if (user) {
    return await sendEmailVerification(user);
  } else {
    throw new Error("No user is currently signed in.");
  }
}

    