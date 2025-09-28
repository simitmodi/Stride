
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
  reauthenticateWithCredential,
  updatePassword,
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { doc, setDoc, updateDoc, Timestamp, deleteDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

export async function signUpWithEmail(
  email: string, 
  password: string, 
  firstName: string,
  lastName: string,
  username: string,
  dateOfBirth: Date,
  role: 'customer' | 'bank' | 'developer' = 'customer',
  bankName?: string,
  designation?: string,
  ifscCode?: string,
  branch?: string,
  address?: string,
): Promise<User | null> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (userCredential.user) {
    const user = userCredential.user;
    const fullName = `${firstName} ${lastName}`;
    await updateProfile(user, { displayName: fullName });

    // Base user data
    const userData: { [key: string]: any } = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      dateOfBirth: Timestamp.fromDate(dateOfBirth),
      email: user.email,
      displayName: fullName,
      uid: user.uid,
      initials: '',
      role: role,
    };
    
    if (role === 'bank') {
      userData.bankName = bankName;
      userData.branch = branch;
      userData.address = address;
      userData.designation = designation;
      userData.ifscCode = ifscCode;
    }

    // Create user document in Firestore
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, userData);
    
    if (role !== 'bank') {
        await sendEmailVerification(user);
    }
    
    return user;
  }
  return null;
}

export async function signInWithEmail(email: string, password: string): Promise<User | null> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  if (userCredential.user) {
    const user = userCredential.user;
    const userDocRef = doc(db, "users", user.uid);
    
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();

    if (userData && userData.role === 'customer') {
      const sessionToken = crypto.randomUUID();
      await updateDoc(userDocRef, { sessionToken });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sessionToken', sessionToken);
      }
    } else if (userDoc.exists() && userData?.role !== 'customer') {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('sessionToken');
        }
    } else if (!userDoc.exists()) {
       // This case is primarily for developers created manually in Firebase console.
    }
  }
  return userCredential.user;
}

export async function signOutUser(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sessionToken');
  }
  return signOut(auth);
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function updateUserProfile(userId: string, data: { [key: string]: any }): Promise<void> {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, data);
}

export async function updateUserEmail(newEmail: string): Promise<void> {
  const user = auth.currentUser;
  if (user) {
    await verifyBeforeUpdateEmail(user, newEmail);
    // After this, Firebase sends a verification email to the new address.
    // The email is updated only after the user clicks the link.
    // You might want to update the email in your Firestore database as well,
    // but only after the user has verified the new email.
    // This can be handled by having the verification link redirect to a page
    // in your app that confirms the change and updates Firestore.
    // For now, we just trigger the Firebase flow.
  } else {
    throw new Error("No user is currently signed in.");
  }
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


export async function changeUserPassword(currentPassword: string, newPassword: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in.");
  }
  // Re-authenticate user before changing password for security
  await reauthenticateUser(currentPassword);
  
  // Update password
  await updatePassword(user, newPassword);
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
