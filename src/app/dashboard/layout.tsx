
"use client";

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/provider';
import Header from "@/components/header";
import { Loader2 } from 'lucide-react';
import { signOutUser } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    // If auth state is not loading and there is no user, redirect to login.
    if (!isUserLoading && !user) {
      router.push('/login');
      return; // No need to set up timers if no user
    }

    if (!user) return;

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
  }, [user, isUserLoading, router, handleLogout]);

  // While checking for the user, show a loading state.
  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  // If user is logged in, render the dashboard.
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
