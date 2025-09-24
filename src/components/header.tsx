"use client";

import { signOutUser } from "@/lib/firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Logo from '@/lib/Logo.png';
import { useUser } from "@/firebase/provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


export default function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

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

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    return name[0];
  };


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-black/10 bg-transparent px-4 md:px-6">
      <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Image src={Logo} alt="Stride Logo" width={100} height={100} />
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                  <AvatarFallback>
                    {user ? getInitials(user.displayName) : <UserIcon />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
