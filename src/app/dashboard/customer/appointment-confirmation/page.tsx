'use client';

import { Suspense, useEffect, useState, useRef, createRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/firebase/provider';
import { doc, Timestamp, collection, getDocs, query, where, getDoc, documentId } from 'firebase/firestore';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";
import { motion } from 'framer-motion';

// Mock Logo Path
const logoPath = '/assets/Logo.png';

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
        const q = query(appointmentsRef, where(documentId(), 'in', ids));
        const querySnapshot = await getDocs(q);
        
        const fetchedAppointments: AppointmentData[] = [];
        querySnapshot.forEach((doc) => {
          fetchedAppointments.push({ id: doc.id, ...doc.data() } as AppointmentData);
        });
        
        if (fetchedAppointments.length === 0) {
          setError("Appointment(s) not found.");
        }
        
        // Sort by time created or id just to be consistent
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
    if (!cardElement) return;
    
    const username = userProfile?.username || 'user';
    const filename = `${appointment.specificService}-${username}-${appointment.bankName}.pdf`.replace(/\s+/g, '_');

    try {
      const canvas = await html2canvas(cardElement, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const cardImgWidth = pdfWidth - 20; 
      const cardImgHeight = (canvas.height * cardImgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 15, cardImgWidth, cardImgHeight);
      pdf.save(filename);
    } catch (e) {
      console.error("PDF generation failed", e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || appointments.length === 0) {
    return (
      <div className="flex w-full h-[calc(100vh-8rem)] items-center justify-center p-4">
        <div className="bg-white/70 backdrop-blur-xl border border-red-100 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading</h2>
          <p className="text-gray-500 mb-8">{error || "Appointments not found"}</p>
          <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl text-white">
            <Link href="/dashboard/customer">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const DetailItem = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100 last:border-0">
      <dt className="font-semibold text-gray-500">{label}</dt>
      <dd className="sm:text-right font-medium text-gray-900">{value || 'N/A'}</dd>
    </div>
  );

  return (
    <div className="relative w-full min-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar pb-16">
      {/* ── Ambient Background Layer ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingDoodles />
      </div>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <style>{`
          .ambient-glow { filter: blur(140px); border-radius: 9999px; position: absolute; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="ambient-glow w-[50vw] h-[50vh] bg-emerald-500/20 top-[-10%] left-[-10%]" />
        <div className="ambient-glow w-[40vw] h-[40vh] bg-teal-400/20 bottom-[10%] right-[-5%]" />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center gap-8 p-4 md:p-8 pt-12">
        <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-6 drop-shadow-md">
                <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Booking Confirmed!</h1>
            <p className="text-gray-500 mt-2 font-medium">Your appointment request has been successfully processed.</p>
        </div>

        {appointments.map((appointment, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={appointment.id} 
            className="w-full max-w-2xl bg-white/70 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Downloadable content container */}
            <div ref={cardRefs.current[index] as any} className="p-8 bg-white/90">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {appointments.length > 1 ? `Service #${index + 1}` : 'Appointment Details'}
                    </h2>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase rounded-full tracking-wider">Confirmed</span>
                </div>
                
                <div className="space-y-6">
                    <dl className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-1">
                        <DetailItem label="Appointment ID" value={appointment.customAppointmentId} />
                        <DetailItem label="Bank Name" value={appointment.bankName} />
                        <DetailItem label="Branch" value={appointment.branch} />
                        <DetailItem label="Address" value={appointment.address} />
                        <DetailItem label="Date" value={appointment.date ? format(appointment.date.toDate(), 'MMMM do, yyyy') : 'N/A'} />
                        <DetailItem label="Time" value={appointment.time} />
                        <DetailItem label="Service Category" value={appointment.serviceCategory} />
                        <DetailItem label="Specific Service" value={appointment.specificService} />
                    </dl>

                    <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50">
                        <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">!</span>
                            Required Documents Checklist
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-indigo-800/80 text-sm font-medium ml-2">
                            {appointment.confirmedDocuments.length > 0 ? (
                            appointment.confirmedDocuments.map((doc, docIndex) => (
                                <li key={docIndex}>{doc.startsWith('documents.') ? doc.split('.')[1] : doc}</li>
                            ))
                            ) : (
                            <li>No specific documents required.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-4 mt-auto">
                <Button 
                    variant="outline"
                    onClick={() => handleDownloadPdf(index, appointment)}
                    className="rounded-xl border-gray-200 hover:bg-white text-gray-600 font-semibold"
                >
                    <Download className="mr-2 h-4 w-4" /> Save as PDF
                </Button>
            </div>
          </motion.div>
        ))}
        
        <div className="mt-8">
            <Button asChild className="rounded-xl h-14 px-8 bg-gray-900 hover:bg-black text-white shadow-xl shadow-gray-200 font-semibold transition-all">
            <Link href="/dashboard/customer">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentConfirmationPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="h-12 w-12 animate-spin text-emerald-500" /></div>}>
            <AppointmentConfirmation />
        </Suspense>
    )
}
