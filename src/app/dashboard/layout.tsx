
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/provider';
import Header from "@/components/header";
import Chatbot from "@/components/dashboard/Chatbot";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isPasskeyAuth, setIsPasskeyAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for demo passkey session
    const hasPasskeyAuth = sessionStorage.getItem("passkey_authenticated") === "true";
    setIsPasskeyAuth(hasPasskeyAuth);

    // If auth state is not loading and there is no user, AND no demo passkey session, redirect to login.
    if (!isUserLoading && !user && !hasPasskeyAuth) {
      router.push('/login');
    }

    // Force light mode on dashboard
    document.documentElement.classList.remove("dark");
    window.localStorage.setItem("theme", "light");
  }, [user, isUserLoading, router]);

  // To prevent hydration errors, always render loading on the server/first-pass.
  if (!mounted || ((isUserLoading || !user) && !isPasskeyAuth)) {
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
      <main className={`flex flex-1 flex-col p-4 md:p-8 pt-6 transition-[padding] duration-300 ${isChatOpen ? "xl:pr-[430px]" : ""}`}>
        {children}
      </main>

      <div
        className={`fixed left-3 right-3 top-20 bottom-3 z-50 sm:left-auto sm:right-6 sm:top-24 sm:bottom-6 sm:w-[380px] transition-transform duration-300 ${
          isChatOpen ? "translate-x-0" : "translate-x-[110%] pointer-events-none"
        }`}
      >
        <Chatbot className="h-full" onClose={() => setIsChatOpen(false)} />
      </div>

      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-xl"
            onClick={() => setIsChatOpen(true)}
            aria-label="Open chat sidebar"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Stride: Professional Financial Connectivity
