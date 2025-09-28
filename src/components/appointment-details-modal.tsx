
'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useFirestore } from '@/firebase/provider';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { Loader2, X } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { format } from 'date-fns';

interface AppointmentDetails {
  customerName: string;
  customerEmail: string;
  accountNumber: string;
  date: string;
  time: string;
  documents: string[];
  serviceCategory: string;
  specificService: string;
  initials: string;
}

interface AppointmentDetailsModalProps {
  appointmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

const getInitials = (name: string) => {
    if (!name) return "AN";
    const nameParts = name.split(" ");
    if (nameParts.length > 1 && nameParts[1]) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    return name.length > 1 ? name.substring(0, 2).toUpperCase() : name.toUpperCase();
};

export function AppointmentDetailsModal({
  appointmentId,
  isOpen,
  onClose,
}: AppointmentDetailsModalProps) {
  const firestore = useFirestore();
  const [details, setDetails] = useState<AppointmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!appointmentId || !isOpen) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const appointmentDocRef = doc(firestore, 'appointments', appointmentId);
        const appointmentDoc = await getDoc(appointmentDocRef);

        if (!appointmentDoc.exists()) {
          throw new Error('Appointment not found.');
        }

        const appointmentData = appointmentDoc.data();
        const userId = appointmentData.userId;

        const userDocRef = doc(firestore, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          throw new Error('Customer details not found.');
        }

        const userData = userDoc.data();

        setDetails({
          customerName: userData.displayName || 'N/A',
          customerEmail: userData.email || 'N/A',
          accountNumber: appointmentData.accountNumber || 'N/A',
          date: format((appointmentData.date as Timestamp).toDate(), 'dd/MM/yyyy'),
          time: appointmentData.time,
          documents: appointmentData.confirmedDocuments || [],
          serviceCategory: appointmentData.serviceCategory || 'N/A',
          specificService: appointmentData.specificService || 'N/A',
          initials: getInitials(userData.displayName),
        });

      } catch (err: any) {
        setError(err.message || 'Failed to fetch details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [appointmentId, isOpen, firestore]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl p-0" 
        style={{backgroundColor: '#D0CBC1', color: '#092910'}}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 relative">
            <DialogTitle className="sr-only">Appointment Details</DialogTitle>
             <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogClose>
        </DialogHeader>
        <div className="p-6 pt-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive h-64 flex items-center justify-center">{error}</div>
          ) : details ? (
            <div className="space-y-4">
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 border-2 border-[#092910]">
                        <AvatarFallback className="text-3xl bg-card text-[#092910] font-bold">
                        {details.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-3xl font-bold">{details.customerName}</h2>
                        <p className="text-sm">Account Number: {details.accountNumber}</p>
                        <p className="text-sm">Email id: {details.customerEmail}</p>
                        <p className="text-sm">{details.date} {details.time}</p>
                    </div>
                </div>

                <Separator style={{backgroundColor: '#092910'}}/>
                
                <div>
                    <h3 className="text-lg font-bold mb-2">Type of Service:</h3>
                    <p className="text-sm italic">
                        {details.serviceCategory} - {details.specificService}
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-2">Documents:</h3>
                    <ol className="list-decimal list-inside space-y-1">
                        {details.documents.map((doc, index) => (
                             <li key={index}>{doc}</li>
                        ))}
                    </ol>
                </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
