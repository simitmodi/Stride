
'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useEffect } from 'react';
import { signOutUser } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function FirebaseErrorListener() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userData } = useDoc(userDocRef);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user || !userData) return;

    const localSessionToken = localStorage.getItem('sessionToken');

    // If there is no local token but there is one in the DB,
    // it means this is a fresh login, so we should set the local token.
    if (!localSessionToken && userData.sessionToken) {
      localStorage.setItem('sessionToken', userData.sessionToken);
      return;
    }

    // If the tokens don't match, it means another device has logged in.
    if (localSessionToken && userData.sessionToken && localSessionToken !== userData.sessionToken) {
      // Clear the local token to prevent re-triggering on the login page
      localStorage.removeItem('sessionToken');

      signOutUser().then(() => {
        toast({
          title: 'Session Expired',
          description: 'You have been logged out because you signed in on another device.',
          variant: 'destructive',
        });
        // Redirect to login page after signing out
        router.push('/login');
      });
    }
  }, [user, userData, isUserLoading, toast, router]);

  return null; // This component does not render anything
}
