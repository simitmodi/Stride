"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import { signOutUser, updateUserProfile, changeUserPassword } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { doc, Timestamp, collection, getDocs, query, where } from "firebase/firestore";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, User, ChevronRight, Pencil, KeyRound, Eye, EyeOff, CalendarCheck, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { format, isAfter, startOfDay, isBefore, parse } from "date-fns";
import { EditableField } from "@/components/editable-field";
import { updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
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
import bankData from '@/lib/ahmedabad_data_with_pincode.json';

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
  specificService: string;
  deleted?: boolean;
}

function BankAppointmentHistory() {
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
    if (!userData?.bankName || !userData?.branch) {
      setIsLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(
          appointmentsRef,
          where('bankName', '==', userData.bankName),
          where('branch', '==', userData.branch)
        );
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

      const aptDate = apt.date?.toDate ? startOfDay(apt.date.toDate()) : today;
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
      if (!apt.date?.toDate) return acc;
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
      const dateA = new Date(a).getTime();
      const dateB = new Date(b).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [grouped, sortOrder]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4">Loading your branch's appointment history...</p>
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
        <p className="text-center text-foreground mt-8">Your branch has no appointment history.</p>
      ) : sortedDateKeys.length === 0 ? (
        <p className="text-center text-foreground mt-8">No appointments match the current filter.</p>
      ) : (
        <div className="space-y-8">
          {sortedDateKeys.map(dateKey => (
            <div key={dateKey}>
              <h3 className="text-xl font-semibold text-primary/80 mb-3">{format(new Date(dateKey + 'T00:00:00'), 'EEEE, MMMM do, yyyy')}</h3>
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


export default function BankProfilePage() {
  const [activeView, setActiveView] = useState<ProfileView>("account");
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [isInitialsDialogOpen, setIsInitialsDialogOpen] = useState(false);
  const [newInitials, setNewInitials] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const uniqueBanks = Array.from(new Set(bankData.map((item) => item.BANK))).sort();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [user, firestore]
  );

  const { data: userData, isLoading: isFirestoreLoading, error: firestoreError } = useDoc(userDocRef);

  const branchesForSelectedBank = useMemo(() => {
    if (userData?.bankName) {
      return bankData
        .filter((item) => item.BANK === userData.bankName)
        .map((item) => item.BRANCH)
        .sort();
    }
    return [];
  }, [userData?.bankName]);

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleUpdateProfile = async (field: string, value: string | Date) => {
    if (!user) return;

    try {
      const updates: { [key: string]: any } = {};
      if (field === 'displayName') {
        const [firstName, ...lastNameParts] = (value as string).split(' ');
        const lastName = lastNameParts.join(' ');
        updates['firstName'] = firstName;
        updates['lastName'] = lastName;
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: value as string });
        }
      } else if (field === 'dateOfBirth' && value instanceof Date) {
        updates[field] = Timestamp.fromDate(value);
      } else if (field === 'branch') {
        const branchDetails = bankData.find(b => b.BANK === userData.bankName && b.BRANCH === value);
        if (branchDetails) {
          updates['branch'] = branchDetails.BRANCH;
          updates['ifscCode'] = branchDetails.IFSC;
          updates['address'] = branchDetails.ADDRESS;
        }
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

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    if (nameParts.length > 1 && nameParts[nameParts.length - 1][0]) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    return name.length > 1 ? name.substring(0, 2).toUpperCase() : name.toUpperCase();
  };

  const overrideInitials = userData?.initials || null;
  const computedInitials = getInitials(userData?.displayName || user?.displayName);
  const avatarText = overrideInitials || computedInitials;

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
    if (dobDate) {
      formattedDob = format(dobDate, 'dd/MM/yyyy');
    }
  }

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
              <Separator className="bg-primary/20" />
              <EditableField
                label="Bank Name"
                value={userData.bankName || "N/A"}
                onSave={(newValue) => handleUpdateProfile('bankName', newValue)}
                inputType="select"
                options={uniqueBanks}
                disabled={!!userData.bankName}
              />
              <Separator className="bg-primary/20" />
              <EditableField
                label="Branch"
                value={userData.branch || "N/A"}
                onSave={(newValue) => handleUpdateProfile('branch', newValue)}
                inputType="select"
                options={branchesForSelectedBank}
                disabled={!userData.bankName || !!userData.branch}
                placeholder={!userData.bankName ? "Select a bank first" : "Select a branch"}
              />
              <Separator className="bg-primary/20" />
              <EditableField
                label="DOB"
                value={formattedDob}
                dateValue={dobDate}
                onSave={(newValue) => handleUpdateProfile('dateOfBirth', newValue)}
                inputType="date"
              />
              <Separator className="bg-primary/20" />
              <EditableField
                label="IFSC Code"
                value={userData.ifscCode || "N/A"}
                onSave={(newValue) => { }}
                disabled={true}
              />
              <Separator className="bg-primary/20" />
              <EditableField
                label="Designation"
                value={userData.designation || "N/A"}
                onSave={(newValue) => handleUpdateProfile('designation', newValue)}
              />
              <Separator className="bg-primary/20" />
              <EditableField
                label="Address"
                value={userData.address || "N/A"}
                onSave={(newValue) => { }}
                disabled={true}
              />
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
              <p className="text-center text-foreground/60 py-12">Notifications will be intoduced in Version 1.1</p>
            </CardContent>
          </Card>
        );
      case "appointments":
        return (
          <Card className="w-full bg-card/75 border border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary font-headline">Branch Appointments</CardTitle>
              <CardDescription className="text-foreground/80 font-body">A complete history of all your branch's appointments.</CardDescription>
            </CardHeader>
            <CardContent>
              <BankAppointmentHistory />
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
        <div className="flex flex-col gap-8 rounded-lg bg-card/75 p-6 border border-primary/20">
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
              <span>Branch Appointments</span>
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
                                <Input type={showNewPassword ? "text" : "password"} {...field} className="pr-10" />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 overflow-x-hidden pt-6">
        {renderContent()}
      </main>
    </div>
  );
}

// Stride: Professional Financial Connectivity
