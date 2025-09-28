
"use client";

import { useUser } from "@/firebase/provider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BankProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && (!user || user.email?.endsWith('@gostride.online'))) {
      // Logic to redirect if not a bank employee
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-primary mb-4">Bank Employee Profile</h1>
      <p className="text-foreground/80">This page is a placeholder and will be updated soon.</p>
    </div>
  );
}
