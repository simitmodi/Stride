
'use client';

import { Suspense, useEffect, useState, useRef, createRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/firebase/provider';
import { doc, Timestamp, collection, getDocs, where, query, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Loader2, Download } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Logo from '@/lib/Logo.png';

interface AppointmentData {
  id: string;
  customAppointmentId: string;
  bankName: string;
  branch: string;
  address: string;
  date: Timestamp;
  time: string;
  serviceCategory: string;
  specificService: string;
  confirmedDocuments: string[];
}

interface UserProfile {
    username: string;
    firstName: string;
    lastName: string;
}

function AppointmentConfirmation() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const appointmentIdsParam = searchParams.get('appointmentId');
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  useEffect(() => {
    if (!appointmentIdsParam) {
      setError("No appointment ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchAppointmentsAndUser = async () => {
      setIsLoading(true);
      const ids = appointmentIdsParam.split(',');
      cardRefs.current = ids.map(() => createRef<HTMLDivElement>());

      try {
        // Fetch appointments
        const appointmentsRef = collection(db, 'appointments');
        const q = query(appointmentsRef, where('__name__', 'in', ids));
        const querySnapshot = await getDocs(q);
        
        const fetchedAppointments: AppointmentData[] = [];
        querySnapshot.forEach((doc) => {
          fetchedAppointments.push({ id: doc.id, ...doc.data() } as AppointmentData);
        });
        
        if (fetchedAppointments.length === 0) {
          setError("Appointment(s) not found.");
        }
        setAppointments(fetchedAppointments);

        // Fetch user profile
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          }
        }

      } catch (e: any) {
        console.error("Error fetching data:", e);
        setError("Could not load appointment details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentsAndUser();
  }, [appointmentIdsParam, user]);

  const handleDownloadPdf = async (cardIndex: number, appointment: AppointmentData) => {
    const cardElement = cardRefs.current[cardIndex].current;
    const username = userProfile?.username || 'user';
    const filename = `${appointment.specificService}-${username}-${appointment.bankName}.pdf`.replace(/\s+/g, '_');

    if (cardElement) {
      const canvas = await html2canvas(cardElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add Logo
      const logoImg = new Image();
      logoImg.src = Logo.src;
      await new Promise(resolve => logoImg.onload = resolve);
      
      const logoWidth = 50;
      const logoHeight = (logoImg.height * logoWidth) / logoImg.width;
      const logoX = (pdfWidth - logoWidth) / 2;
      pdf.addImage(logoImg, 'PNG', logoX, 10, logoWidth, logoHeight);

      // Add Card Image
      const cardImgWidth = pdfWidth - 20; // with some margin
      const cardImgHeight = (canvas.height * cardImgWidth) / canvas.width;
      const cardY = 15 + logoHeight;

      if (cardY + cardImgHeight > pdfHeight) {
        // If it overflows, consider splitting into multiple pages or scaling down
        // For simplicity, we scale to fit
        const scale = (pdfHeight - cardY - 10) / cardImgHeight;
        pdf.addImage(imgData, 'PNG', 10, cardY, cardImgWidth * scale, cardImgHeight * scale);
      } else {
        pdf.addImage(imgData, 'PNG', 10, cardY, cardImgWidth, cardImgHeight);
      }
      
      pdf.save(filename);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4">Loading your confirmation(s)...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-destructive">Error</h2>
        <p>{error}</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/customer">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Appointment Not Found</h2>
        <p>The requested appointment(s) could not be found.</p>
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
    <div className="flex w-full flex-col items-center gap-8 p-4 md:p-8" style={{ backgroundColor: '#BFBAB0' }}>
      {appointments.map((appointment, index) => (
        <Card key={appointment.id} className="w-full max-w-2xl shadow-lg" style={{ backgroundColor: '#D0CBC1' }}>
           <div ref={cardRefs.current[index]}>
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-green-700">
                    &#9989; Appointment {appointments.length > 1 ? `#${index + 1}`:''} Confirmed!
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
                        <DetailItem label="Bank Address" value={appointment.address} />
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
                </CardContent>
            </div>
          <CardFooter className="justify-center">
            <Button onClick={() => handleDownloadPdf(index, appointment)}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardFooter>
        </Card>
      ))}
      <div className="flex justify-center pt-2">
        <Button asChild className="w-full max-w-xs">
          <Link href="/dashboard/customer">Go to Dashboard</Link>
        </Button>
      </div>
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

    