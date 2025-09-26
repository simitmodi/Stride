
"use client";

import { useState } from "react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import { signOutUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { doc } from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, User, LogOut, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

type ProfileView = "account" | "notifications";

export default function ProfilePage() {
  const [activeView, setActiveView] = useState<ProfileView>("account");
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [user, firestore]
  );
  
  const { data: userData, isLoading: isFirestoreLoading } = useDoc(userDocRef);

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/login");
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
    return name.length > 1 ? name.substring(0,2).toUpperCase() : name.toUpperCase();
  };

  if (isUserLoading || isFirestoreLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This case is mostly handled by the layout, but it's good practice.
    return null;
  }

  const dobTimestamp = userData?.dateOfBirth;
  let formattedDob = "N/A";
  if (dobTimestamp && typeof dobTimestamp.toDate === 'function') {
      formattedDob = format(dobTimestamp.toDate(), 'MM/dd/yyyy');
  }

  const creationTime = user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleString() : "N/A";
  const lastSignInTime = user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : "N/A";

  const renderContent = () => {
    switch (activeView) {
      case "account":
        return (
          <Card className="w-full bg-card/75 border border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary font-headline">Account Settings</CardTitle>
              <CardDescription className="text-foreground/80 font-body">Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm font-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground/70">Full Name</p>
                  <p className="text-foreground">{user.displayName || "N/A"}</p>
                </div>
                <Button variant="link" className="text-primary hover:text-accent">Edit</Button>
              </div>
              <Separator className="bg-primary/20"/>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground/70">DOB</p>
                  <p className="text-foreground">{formattedDob}</p>
                </div>
                <Button variant="link" className="text-primary hover:text-accent">Edit</Button>
              </div>
              <Separator className="bg-primary/20"/>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground/70">Phone Number</p>
                  <p className="text-foreground">{user.phoneNumber || "N/A"}</p>
                </div>
                <Button variant="link" className="text-primary hover:text-accent">Edit</Button>
              </div>
              <Separator className="bg-primary/20"/>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground/70">Email Verified</p>
                  <p className="text-foreground">{user.emailVerified ? "Yes" : "No"}</p>
                </div>
              </div>
              <Separator className="bg-primary/20"/>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground/70">Email Address</p>
                  <p className="text-foreground">{user.email || "N/A"}</p>
                </div>
                <Button variant="link" className="text-primary hover:text-accent">Edit</Button>
              </div>
              <Separator className="bg-primary/20"/>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground/70">Last Sign in</p>
                  <p className="text-foreground">{lastSignInTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case "notifications":
        return (
           <Card className="w-full bg-card/75 border border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary font-headline">Notifications</CardTitle>
              <CardDescription className="text-foreground/80 font-body">This feature will be added soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-foreground/60 py-12">No notification settings available yet.</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full flex-grow flex-col md:flex-row bg-background font-body text-foreground">
      {/* Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 p-4 md:p-6">
        <div className="sticky top-24 flex flex-col gap-8 rounded-lg bg-card/75 p-6 border border-primary/20">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
              <AvatarFallback className="text-3xl bg-muted text-primary font-bold">
                {getInitials(user.displayName)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold font-headline text-primary">{user.displayName}</h2>
            <p className="text-sm text-foreground/70 break-all">{user.email}</p>
          </div>
          <nav className="flex flex-col gap-2">
            <Button
              variant="ghost"
              className={`justify-start items-center gap-3 text-base h-12 px-4 transition-all
                ${activeView === 'account' 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' 
                  : 'text-foreground hover:bg-accent/50'
                }`}
              onClick={() => setActiveView("account")}
            >
              <User className="h-5 w-5" />
              <span>Account Settings</span>
              {activeView === 'account' && <ChevronRight className="ml-auto h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              className={`justify-start items-center gap-3 text-base h-12 px-4 transition-all
                ${activeView === 'notifications' 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' 
                  : 'text-foreground hover:bg-accent/50'
                }`}
              onClick={() => setActiveView("notifications")}
            >
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {activeView === 'notifications' && <ChevronRight className="ml-auto h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              className="justify-start items-center gap-3 text-base h-12 px-4 text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6">
        {renderContent()}
      </main>
    </div>
  );
}

    