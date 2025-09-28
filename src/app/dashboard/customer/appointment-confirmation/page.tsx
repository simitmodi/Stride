
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFirestore, useUser, useMemoFirebase } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface AppointmentData {
  customAppointmentId: string;
  bankName: string;
  branch: string;
  date: Timestamp;
  time: string;
  serviceCategory: string;
  specificService: string;
  confirmedDocuments: string[];
}

function AppointmentConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const { user } = useUser();
  const firestore = useFirestore();

  const appointmentDocRef = useMemoFirebase(
    () => (user && appointmentId ? doc(firestore, `users/${user.uid}/appointments`, appointmentId) : null),
    [user, appointmentId, firestore]
  );

  const { data: appointment, isLoading, error } = useDoc<AppointmentData>(appointmentDocRef);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4">Loading your confirmation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-destructive">Error</h2>
        <p>Could not load appointment details. Please try again later.</p>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Appointment Not Found</h2>
        <p>The requested appointment could not be found.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/customer">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const DetailItem = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between">
      <dt className="font-semibold text-foreground/80">{label}</dt>
      <dd className="sm:text-right text-foreground">{value || 'N/A'}</dd>
    </div>
  );

  return (
    <div className="flex w-full flex-col items-center p-4 md:p-8" style={{ backgroundColor: '#BFBAB0' }}>
      <Card className="w-full max-w-2xl shadow-lg" style={{ backgroundColor: '#D0CBC1' }}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-700">
            &#9989; Appointment Confirmed!
          </CardTitle>
          <CardDescription style={{ color: '#000F00' }}>
            Your appointment has been successfully booked. Please find the details below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 rounded-lg border border-foreground/20 bg-background/5 p-4">
            <dl className="space-y-3">
              <DetailItem label="Appointment ID" value={appointment.customAppointmentId} />
              <DetailItem label="Bank Name & Branch" value={`${appointment.bankName} - ${appointment.branch}`} />
              <DetailItem label="Date & Time" value={`${format(appointment.date.toDate(), 'PPP')} at ${appointment.time}`} />
              <DetailItem label="Service Requested" value={`${appointment.serviceCategory} - ${appointment.specificService}`} />
            </dl>
          </div>

          <div className="space-y-2 rounded-lg border border-foreground/20 bg-background/5 p-4">
            <h4 className="font-semibold text-foreground/80">Documents to Bring:</h4>
            <ul className="list-disc list-inside space-y-1 text-foreground">
              {appointment.confirmedDocuments.length > 0 ? (
                appointment.confirmedDocuments.map((doc, index) => (
                  <li key={index}>{doc.startsWith('documents.') ? doc.split('.')[1] : doc}</li>
                ))
              ) : (
                <li>No documents confirmed.</li>
              )}
            </ul>
          </div>
          
          <div className="flex justify-center pt-6">
            <Button asChild className="w-full max-w-xs">
              <Link href="/dashboard/customer">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AppointmentConfirmationPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
            <AppointmentConfirmation />
        </Suspense>
    )
}

    