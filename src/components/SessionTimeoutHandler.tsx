
"use client";

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/provider';
import { signOutUser } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export default function SessionTimeoutHandler({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = useCallback(() => {
    signOutUser().then(() => {
      toast({
        title: 'Session Timed Out',
        description: 'You have been logged out due to inactivity.',
        variant: 'destructive',
      });
      router.push('/login');
    });
  }, [router, toast]);

  useEffect(() => {
    if (isUserLoading || !user) {
      return; 
    }

    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
    
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
    
    resetTimer(); // Initialize timer

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, isUserLoading, handleLogout]);

  return <>{children}</>;
}
