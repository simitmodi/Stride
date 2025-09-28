
"use client";

import { useUser } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { BankEmployeeSignUpForm } from '@/components/auth/bank-employee-signup-form';

export default function DeveloperDashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && (!user || !user.email?.endsWith('@gostride.online'))) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-primary mb-4">Developer Dashboard</h1>
      <p className="text-foreground/80 mb-8">Welcome, {user.displayName || user.email}.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Manage Bank Employees</CardTitle>
            <CardDescription>Create new accounts for bank staff.</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Bank Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-card/95" style={{ backdropFilter: 'blur(12px)' }}>
                <DialogHeader>
                  <DialogTitle className="text-primary">Create Bank Employee Account</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new account for a bank employee.
                  </DialogDescription>
                </DialogHeader>
                <BankEmployeeSignUpForm />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
