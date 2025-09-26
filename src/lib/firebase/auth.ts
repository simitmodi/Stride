
"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
  sendEmailVerification,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import { doc, setDoc, updateDoc, Timestamp, deleteDoc } from "firebase/firestore";
import { auth, db } from "./config";

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
      dateOfBirth: Timestamp.fromDate(dateOfBirth),
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

export async function reauthenticateUser(password: string): Promise<void> {
  const user = auth.currentUser;
  if (user && user.email) {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } else {
    throw new Error("No user is currently signed in or user has no email.");
  }
}

export async function deleteUserAccount(password: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in.");
  }

  // Re-authenticate the user first
  await reauthenticateUser(password);

  // After successful re-authentication, delete the Firestore document
  const userDocRef = doc(db, "users", user.uid);
  await deleteDoc(userDocRef);

  // Finally, delete the user from Firebase Authentication
  await deleteUser(user);
}

    