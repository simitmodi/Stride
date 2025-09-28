
"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import { updateUserProfile } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { doc, Timestamp } from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { EditableField } from "@/components/editable-field";
import { auth, db } from "@/lib/firebase/config";
import { updateProfile } from "firebase/auth";
import bankData from '@/lib/ahmedabad_data_with_pincode.json';


export default function BankProfilePage() {
  const [activeView, setActiveView] = useState<string>("account");
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const uniqueBanks = Array.from(new Set(bankData.map((item) => item.BANK))).sort();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [user, firestore]
  );
  
  const { data: userData, isLoading: isFirestoreLoading, error: firestoreError } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserLoading && (!user || userData?.role !== 'bank')) {
      // Redirect if not a bank employee or data is loaded and role is not bank
      // router.push('/login');
    }
  }, [user, userData, isUserLoading, router]);

  const handleUpdateProfile = async (field: string, value: string | Date) => {
    if (!user) return;

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
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    if (nameParts.length > 1 && nameParts[nameParts.length - 1][0]) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    return name.length > 1 ? name.substring(0,2).toUpperCase() : name.toUpperCase();
  };
  
  if (isUserLoading || isFirestoreLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background" style={{ backgroundColor: '#BFBAB0' }}>
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

  const avatarText = userData?.initials || getInitials(userData?.displayName || user?.displayName);
  let formattedDob = "N/A";
  let dobDate: Date | undefined;
  const dobTimestamp = userData?.dateOfBirth;

  if (dobTimestamp && typeof dobTimestamp.toDate === 'function') {
      dobDate = dobTimestamp.toDate();
      formattedDob = format(dobDate, 'dd/MM/yyyy');
  }

  const renderContent = () => (
    <Card className="w-full shadow-lg" style={{ backgroundColor: '#D0CBC1' }}>
      <CardHeader>
        <CardTitle className="text-3xl font-bold font-headline" style={{color: "#092910"}}>Account Settings</CardTitle>
        <CardDescription className="font-body text-foreground/80">Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-sm font-body">
         <EditableField
            label="Full Name"
            value={userData.displayName || "N/A"}
            onSave={(newValue) => handleUpdateProfile('displayName', newValue)}
          />
        <Separator className="bg-primary/20"/>
        <EditableField
            label="Bank Name"
            value={userData.bankName || "N/A"}
            onSave={(newValue) => handleUpdateProfile('bankName', newValue)}
            inputType="select"
            options={uniqueBanks}
          />
        <Separator className="bg-primary/20"/>
         <EditableField
            label="DOB"
            value={formattedDob}
            dateValue={dobDate}
            onSave={(newValue) => handleUpdateProfile('dateOfBirth', newValue)}
            inputType="date"
          />
        <Separator className="bg-primary/20"/>
        <EditableField
            label="IFSC Code"
            value={userData.ifscCode || "N/A"}
            onSave={(newValue) => handleUpdateProfile('ifscCode', newValue)}
          />
        <Separator className="bg-primary/20"/>
         <EditableField
            label="Designation"
            value={userData.designation || "N/A"}
            onSave={(newValue) => handleUpdateProfile('designation', newValue)}
          />
      </CardContent>
    </Card>
  );

  return (
    <div className="flex w-full flex-grow flex-col md:flex-row font-body text-foreground" style={{ backgroundColor: '#BFBAB0' }}>
      {/* Sidebar */}
      <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 p-4 md:p-6">
        <div className="sticky top-24 flex flex-col gap-8 rounded-lg p-6">
          <div className="flex flex-col items-center text-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-primary bg-card">
              <AvatarFallback className="text-3xl bg-card text-primary font-bold">
                {avatarText}
              </AvatarFallback>
            </Avatar>
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
