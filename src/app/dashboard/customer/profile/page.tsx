
"use client";

import { useState } from "react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import { signOutUser, updateUserProfile, sendVerificationEmail, deleteUserAccount, reauthenticateUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { doc, Timestamp } from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, User, LogOut, ChevronRight, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { EditableField } from "@/components/editable-field";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription as DialogDescriptionComponent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


type ProfileView = "account" | "notifications";

export default function ProfilePage() {
  const [activeView, setActiveView] = useState<ProfileView>("account");
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [isInitialsDialogOpen, setIsInitialsDialogOpen] = useState(false);
  const [newInitials, setNewInitials] = useState("");

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

  const handleSendVerification = async () => {
    if (!user) return;
    setIsVerifying(true);
    try {
      await sendVerificationEmail();
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox to verify your email address.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Could not send verification email. Please try again later.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUpdateProfile = async (field: string, value: string | Date) => {
    if (!user) return;
    try {
      const updates: { [key: string]: any } = {};
      if (field === 'displayName') {
        const [firstName, ...lastNameParts] = (value as string).split(' ');
        const lastName = lastNameParts.join(' ');
        updates['firstName'] = firstName;
        updates['lastName'] = lastName;
        updates['displayName'] = value;
        // Also update the auth profile for consistency in other parts of the app
        if(auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: value as string });
        }
      } else if (field === 'dateOfBirth' && value instanceof Date) {
        updates[field] = Timestamp.fromDate(value);
      } else if (field === 'initials') {
         updates[field] = value;
         toast({
            title: "Profile Updated",
            description: "Your Avatar has been updated.",
         });
         return;
      }
      else {
        updates[field] = value;
      }
      
      await updateUserProfile(user.uid, updates);
      toast({
        title: "Profile Updated",
        description: `Your ${field.replace(/([A-Z])/g, ' $1')} has been updated.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update your profile.",
      });
    }
  };

    const handleDeleteAccount = async () => {
    if (!user || !password) {
      toast({ variant: "destructive", title: "Error", description: "Password is required." });
      return;
    }
    setIsDeleting(true);
    try {
      await deleteUserAccount(password);
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      setIsDeleteAlertOpen(false);
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error.message || "Could not delete your account. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirm("");
      setPassword("");
    }
  };


  const getInitials = (name: string | null | undefined) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    if (nameParts.length > 1 && nameParts[1]) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    return name.length > 1 ? name.substring(0,2).toUpperCase() : name.toUpperCase();
  };
  
  const avatarText = userData?.initials || getInitials(userData?.displayName);

  const handleInitialsSave = async () => {
    await handleUpdateProfile('initials', newInitials);
    setIsInitialsDialogOpen(false);
  }


  if (isUserLoading || isFirestoreLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !userData) {
    // This case is mostly handled by the layout, but it's good practice.
    return null;
  }

  const dobTimestamp = userData?.dateOfBirth;
  let dobDate: Date | undefined = undefined;
  let formattedDob = "N/A";
  if (dobTimestamp && typeof dobTimestamp.toDate === 'function') {
      dobDate = dobTimestamp.toDate();
      formattedDob = format(dobDate, 'dd/MM/yyyy');
  }

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
              <EditableField
                label="Full Name"
                value={userData.displayName || "N/A"}
                onSave={(newValue) => handleUpdateProfile('displayName', newValue)}
              />
              <Separator className="bg-primary/20"/>
              <EditableField
                label="Username"
                value={userData.username || "N/A"}
                onSave={(newValue) => handleUpdateProfile('username', newValue)}
              />
              <Separator className="bg-primary/20"/>
              <EditableField
                label="Date of Birth"
                value={formattedDob}
                dateValue={dobDate}
                onSave={(newValue) => handleUpdateProfile('dateOfBirth', newValue)}
                inputType="date"
              />
              <Separator className="bg-primary/20"/>
               <EditableField
                label="Phone Number"
                value={userData.phoneNumber ? `+91 ${userData.phoneNumber}` : "N/A"}
                editValue={userData.phoneNumber || ""}
                onSave={(newValue) => handleUpdateProfile('phoneNumber', newValue as string)}
                inputType="tel"
              />
              <Separator className="bg-primary/20"/>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground/70">Email Verified</p>
                  <p className="text-foreground">{user.emailVerified ? "Yes" : "No"}</p>
                </div>
                 {!user.emailVerified && (
                  <Button 
                    variant="link" 
                    className="text-primary hover:text-accent" 
                    onClick={handleSendVerification}
                    disabled={isVerifying}
                  >
                    {isVerifying ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : null}
                    Send Verification
                  </Button>
                )}
              </div>
              <Separator className="bg-primary/20"/>
               <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground/70">Email Address</p>
                  <p className="text-foreground">{userData.email || "N/A"}</p>
                </div>
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
      <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 p-4 md:p-6">
        <div className="sticky top-24 flex flex-col gap-8 rounded-lg bg-card/75 p-6 border border-primary/20">
          <div className="flex flex-col items-center text-center gap-4">
             <Dialog open={isInitialsDialogOpen} onOpenChange={setIsInitialsDialogOpen}>
              <DialogTrigger asChild>
                <div className="relative group cursor-pointer">
                  <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarFallback className="text-3xl bg-card text-primary font-bold">
                      {avatarText}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-card/75 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="h-8 w-8 text-white" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-card/95" style={{ backdropFilter: 'blur(12px)' }}>
                <DialogHeader>
                  <DialogTitle className="text-primary">Edit Initials</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="initials-input" className="text-right">
                      Initials
                    </Label>
                    <Input
                      id="initials-input"
                      value={newInitials}
                      onChange={(e) => setNewInitials(e.target.value)}
                      className="col-span-3"
                      maxLength={2}
                      placeholder="2 characters or emoji"
                    />
                  </div>
                   <DialogDescriptionComponent className="text-foreground/80 text-sm col-span-4 text-center pt-2">
                    To use an emoji, use the keyboard shortcut for your OS (Windows: Win + . | macOS: Ctrl + Cmd + Space).
                  </DialogDescriptionComponent>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="button" onClick={handleInitialsSave}>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold font-headline text-primary">{userData.displayName}</h2>
              <p className="text-sm text-foreground/70 break-all">{userData.email}</p>
            </div>
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
            
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="justify-start items-center gap-3 text-base h-12 px-4 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Delete Account</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from our servers. To confirm, please enter your password and type <strong>DELETE</strong> below.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="confirm-delete" className="text-right">Confirm</Label>
                    <Input
                      id="confirm-delete"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => { setDeleteConfirm(""); setPassword(""); }}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirm !== "DELETE" || isDeleting || !password}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
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

    