
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/provider';
import Header from "@/components/header";
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If auth state is not loading and there is no user, redirect to login.
    if (!isUserLoading && !user) {
      router.push('/login');
    }

    // Force light mode on dashboard
    document.documentElement.classList.remove("dark");
    window.localStorage.setItem("theme", "light");
  }, [user, isUserLoading, router]);

  // While checking for the user, show a loading state.
  if (isUserLoading || !user) {
    return (
      <div className="dashboard-theme flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  // If user is logged in, render the dashboard.
  return (
    <div className="dashboard-theme flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
