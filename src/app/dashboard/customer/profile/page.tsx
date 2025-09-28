
"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import { signOutUser, updateUserProfile, sendVerificationEmail, deleteUserAccount, changeUserPassword, reauthenticateUser, updateUserEmail } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { doc, Timestamp, collection, getDocs, query, where } from "firebase/firestore";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, User, LogOut, ChevronRight, Trash2, Pencil, KeyRound, Eye, EyeOff, CalendarCheck, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { format, isAfter, startOfDay, parse, isBefore } from "date-fns";
import { EditableField } from "@/components/editable-field";
import { updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordStrength } from "@/components/password-strength";


type ProfileView = "account" | "notifications" | "appointments";

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface AppointmentHistoryData {
  id: string;
  customAppointmentId: string;
  bankName: string;
  branch: string;
  date: Timestamp;
  time: string;
  serviceCategory: string;
  specificService: string;
  deleted?: boolean;
}

function AppointmentHistory() {
    const { user } = useUser();
    const [appointments, setAppointments] = useState<AppointmentHistoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    const userDocRef = useMemoFirebase(
      () => (user ? doc(db, "users", user.uid) : null),
      [user]
    );
    const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

    useEffect(() => {
        if (isUserLoading) return;
        if (!userData?.appointmentIds || userData.appointmentIds.length === 0) {
            setIsLoading(false);
            return;
        }

        const fetchAppointments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const appointmentsRef = collection(db, "appointments");
                const q = query(appointmentsRef, where('__name__', 'in', userData.appointmentIds));
                const appointmentSnapshots = await getDocs(q);
                
                const fetchedAppointments: AppointmentHistoryData[] = [];
                appointmentSnapshots.forEach((doc) => {
                    fetchedAppointments.push({ id: doc.id, ...doc.data() } as AppointmentHistoryData);
                });
                
                setAppointments(fetchedAppointments);
            } catch (e: any) {
                console.error("Error fetching appointment history:", e);
                setError("Could not load appointment history.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, [userData, isUserLoading]);

    const filteredAndSortedAppointments = useMemo(() => {
      const today = startOfDay(new Date());

      const filtered = appointments.filter(apt => {
        if (filter === 'cancelled') {
          return apt.deleted === true;
        }
        if (apt.deleted) return false;

        const aptDate = startOfDay(apt.date.toDate());
        if (filter === 'upcoming') {
          return !isBefore(aptDate, today);
        }
        if (filter === 'past') {
          return isBefore(aptDate, today);
        }
        return true; // 'all'
      });

      return filtered;

    }, [appointments, filter]);
    
    const grouped = useMemo(() => {
      const groupedData = filteredAndSortedAppointments.reduce((acc, apt) => {
        const dateKey = format(apt.date.toDate(), 'yyyy-MM-dd');
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(apt);
        return acc;
      }, {} as Record<string, AppointmentHistoryData[]>);

      return groupedData;
    }, [filteredAndSortedAppointments]);

    const sortedDateKeys = useMemo(() => {
      const keys = Object.keys(grouped);
      return keys.sort((a, b) => {
        const dateA = parse(a, 'yyyy-MM-dd', new Date()).getTime();
        const dateB = parse(b, 'yyyy-MM-dd', new Date()).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
    }, [grouped, sortOrder]);


    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4">Loading your appointment history...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-destructive mt-8">{error}</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card/50 rounded-lg border border-primary/20">
                <div className="flex flex-wrap gap-2">
                    {(['all', 'upcoming', 'past', 'cancelled'] as const).map(f => (
                        <Button 
                            key={f} 
                            variant={filter === f ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(f)}
                            className="capitalize"
                        >
                            {f}
                        </Button>
                    ))}
                </div>
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                >
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                </Button>
            </div>

            {appointments.length === 0 ? (
                <p className="text-center text-foreground mt-8">You have no appointment history.</p>
            ) : sortedDateKeys.length === 0 ? (
                <p className="text-center text-foreground mt-8">No appointments match the current filter.</p>
            ) : (
                <div className="space-y-8">
                    {sortedDateKeys.map(dateKey => (
                        <div key={dateKey}>
                            <h3 className="text-xl font-semibold text-primary/80 mb-3">{format(parse(dateKey, 'yyyy-MM-dd', new Date()), 'EEEE, MMMM do, yyyy')}</h3>
                            <div className="space-y-4">
                                {grouped[dateKey].map(apt => (
                                    <Card key={apt.id} className={`bg-card/75 transition-shadow hover:shadow-md ${apt.deleted ? 'opacity-60' : ''}`}>
                                        <CardContent className="p-4 flex justify-between items-center gap-4">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">{apt.specificService}</CardTitle>
                                                <CardDescription className="text-foreground/80">{apt.bankName} - {apt.branch}</CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{apt.time}</p>
                                                <p className="text-sm text-foreground/80">ID: {apt.customAppointmentId}</p>
                                            </div>
                                            {apt.deleted && (
                                                <div className="border-l border-foreground/20 pl-4">
                                                    <span className="text-sm font-bold text-destructive">CANCELLED</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProfilePage() {
  const [activeView, setActiveView] = useState<ProfileView>("account");
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const [isInitialsDialogOpen, setIsInitialsDialogOpen] = useState(false);
  const [newInitials, setNewInitials] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [isReauthDialogOpen, setIsReauthDialogOpen] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [isReauthing, setIsReauthing] = useState(false);
  const [onReauthSuccess, setOnReauthSuccess] = useState<(() => Promise<void>) | null>(null);


  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [user, firestore]
  );
  
  const { data: userData, isLoading: isFirestoreLoading, error: firestoreError } = useDoc(userDocRef);

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

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
  
  const handleUpdateEmail = async (newEmail: string) => {
    try {
      await updateUserEmail(newEmail);
      await updateUserProfile(user.uid, { email: newEmail });
      toast({
        title: "Verification Email Sent",
        description: `A verification email has been sent to ${newEmail}. Please verify to update your email address.`,
      });
    } catch(error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast({
          variant: "destructive",
          title: "Action Required",
          description: "For security, please re-enter your password to continue.",
        });
        // Store the action to be performed after re-authentication
        setOnReauthSuccess(() => () => handleUpdateEmail(newEmail));
        setIsReauthDialogOpen(true);
      } else {
         toast({
          variant: "destructive",
          title: "Update Failed",
          description: error.message || "Could not update your email.",
        });
      }
    }
  };

  const handleUpdateProfile = async (field: string, value: string | Date) => {
    if (!user) return;

    if (field === 'email') {
      await handleUpdateEmail(value as string);
      return;
    }

    try {
      const updates: { [key: string]: any } = {};
      if (field === 'displayName') {
        const [firstName, ...lastNameParts] = (value as string).split(' ');
        const lastName = lastNameParts.join(' ');
        updates['firstName'] = firstName;
        updates['lastName'] = lastName;
        if(auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: value as string });
        }
      } else if (field === 'dateOfBirth' && value instanceof Date) {
        updates[field] = Timestamp.fromDate(value);
      } else {
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
    if (!user || !deletePassword) {
      toast({ variant: "destructive", title: "Error", description: "Password is required." });
      return;
    }
    setIsDeleting(true);
    try {
      await deleteUserAccount(deletePassword);
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      router.push("/");
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
         toast({
          variant: "destructive",
          title: "Action Required",
          description: "For security, please re-enter your password to continue.",
        });
        setOnReauthSuccess(() => handleDeleteAccount);
        setIsReauthDialogOpen(true);
        setIsDeleting(false);
      } else {
        toast({
          variant: "destructive",
          title: "Deletion Failed",
          description: error.message || "Could not delete your account. Please try again.",
        });
      }
    } finally {
      if (error.code !== 'auth/requires-recent-login') {
        setIsDeleting(false);
        setDeleteConfirm("");
        setDeletePassword("");
      }
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    if (nameParts.length > 1 && nameParts[nameParts.length - 1][0]) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    return name.length > 1 ? name.substring(0,2).toUpperCase() : name.toUpperCase();
  };
  
  const avatarText = userData?.initials || getInitials(userData?.displayName || user?.displayName);

  const handleInitialsSave = async () => {
    if (!user) return;
    try {
        await updateUserProfile(user.uid, { initials: newInitials });
        toast({
            title: "Profile Updated",
            description: "Your Avatar has been updated.",
        });
        setIsInitialsDialogOpen(false);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: error.message || "Could not update your profile.",
        });
    }
  };
  
  const onSubmitPasswordChange = async (values: z.infer<typeof passwordFormSchema>) => {
    try {
      await changeUserPassword(values.currentPassword, values.newPassword);
      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });
      setIsPasswordDialogOpen(false);
      passwordForm.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password Change Failed",
        description: error.message === 'auth/wrong-password' ? 'The current password you entered is incorrect.' : error.message || "Could not change your password.",
      });
    }
  };

  const handleReauthentication = async () => {
    if (!reauthPassword) {
      toast({ variant: "destructive", title: "Error", description: "Password is required." });
      return;
    }
    setIsReauthing(true);
    try {
      await reauthenticateUser(reauthPassword);
      toast({ title: "Re-authenticated successfully", description: "You can now complete your previous action." });
      setIsReauthDialogOpen(false);
      setReauthPassword("");
      if (onReauthSuccess) {
        await onReauthSuccess(); // Retry the original action
        setOnReauthSuccess(null);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "The password you entered is incorrect. Please try again.",
      });
    } finally {
      setIsReauthing(false);
    }
  };


  if (isUserLoading || isFirestoreLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !userData) {
    if (firestoreError) {
      console.error("Firestore error:", firestoreError);
    }
    return null;
  }

  let formattedDob = "N/A";
  let dobDate: Date | undefined;
  const dobTimestamp = userData?.dateOfBirth;

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
              <EditableField
                label="Email Address"
                value={userData.email || "N/A"}
                onSave={(newValue) => handleUpdateProfile('email', newValue)}
                inputType="email"
              />
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
      case "appointments":
        return (
           <Card className="w-full bg-card/75 border border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary font-headline">My Appointments</CardTitle>
              <CardDescription className="text-foreground/80 font-body">A complete history of all your appointments.</CardDescription>
            </CardHeader>
            <CardContent>
                <AppointmentHistory />
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
                ${activeView === 'appointments' 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' 
                  : 'text-foreground hover:bg-accent/50'
                }`}
              onClick={() => setActiveView("appointments")}
            >
              <CalendarCheck className="h-5 w-5" />
              <span>My Appointments</span>
              {activeView === 'appointments' && <ChevronRight className="ml-auto h-5 w-5" />}
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

            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="justify-start items-center gap-3 text-base h-12 px-4 text-foreground hover:bg-accent/50">
                  <KeyRound className="h-5 w-5" />
                  <span>Change Password</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-card/95" style={{ backdropFilter: 'blur(12px)' }}>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onSubmitPasswordChange)}>
                    <DialogHeader>
                      <DialogTitle className="text-primary">Change Password</DialogTitle>
                      <DialogDescriptionComponent className="text-foreground/80">
                        Enter your current password and a new password.
                      </DialogDescriptionComponent>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input type={showCurrentPassword ? "text" : "password"} {...field} className="pr-10" />
                              </FormControl>
                              <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowCurrentPassword(prev => !prev)}>
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type={showNewPassword ? "text" : "password"}
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setNewPassword(e.target.value);
                                  }}
                                  className="pr-10"
                                />
                              </FormControl>
                              <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowNewPassword(prev => !prev)}>
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                             {newPassword && <PasswordStrength password={newPassword} />}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                             <div className="relative">
                              <FormControl>
                                <Input type={showConfirmPassword ? "text" : "password"} {...field} className="pr-10" />
                              </FormControl>
                              <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(prev => !prev)}>
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                        {passwordForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <AlertDialog>
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
                  <AlertDialogDescription className="text-foreground/80">
                    This action cannot be undone. This will permanently delete your account and remove your data from our servers. To confirm, please enter your password and type <strong>DELETE</strong> below.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password-delete" className="text-right">Password</Label>
                    <Input
                      id="password-delete"
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
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
                  <AlertDialogCancel onClick={() => { setDeleteConfirm(""); setDeletePassword(""); }}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirm !== "DELETE" || isDeleting || !deletePassword}
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

      {/* Re-authentication Dialog */}
      <Dialog open={isReauthDialogOpen} onOpenChange={setIsReauthDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card/95" style={{ backdropFilter: 'blur(12px)' }}>
          <DialogHeader>
            <DialogTitle className="text-primary">Re-authentication Required</DialogTitle>
            <DialogDescriptionComponent className="text-foreground/80">
              For your security, please enter your password again to continue.
            </DialogDescriptionComponent>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reauth-password" className="text-right">
                Password
              </Label>
              <Input
                id="reauth-password"
                type="password"
                value={reauthPassword}
                onChange={(e) => setReauthPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={() => { setOnReauthSuccess(null); setReauthPassword(""); }}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleReauthentication} disabled={isReauthing}>
              {isReauthing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
