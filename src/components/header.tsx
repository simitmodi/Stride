"use client";

import { signOutUser } from "@/lib/firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message || "Could not log you out.",
      });
    }
  };

  const getDashboardLink = () => {
    if (pathname.startsWith("/dashboard/bank")) {
      return "/dashboard/bank";
    }
    if (pathname.startsWith("/dashboard/customer")) {
      return "/dashboard/customer";
    }
    return "/"; // Fallback to home
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
        <Link
          href={getDashboardLink()}
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Image src="/Logo.png" alt="Stride Logo" width={24} height={24} />
          <span className="font-bold">Stride</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>
    </header>
  );
}
