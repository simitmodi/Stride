
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Archive, Loader2 } from "lucide-react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from "./ui/card";
import { format, isBefore, startOfDay } from 'date-fns';

interface AppointmentData {
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

export default function PastAppointments() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [pastAppointments, setPastAppointments] = useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userDocRef = useMemoFirebase(
    () => (user ? collection(firestore, "appointments") : null),
    [user, firestore]
  );

  useEffect(() => {
    if (isUserLoading || !user) {
      if (!isUserLoading) setIsLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const q = query(userDocRef!, where("userId", "==", user.uid));
        const appointmentSnapshots = await getDocs(q);
        
        const fetchedAppointments: AppointmentData[] = [];
        const today = startOfDay(new Date());

        appointmentSnapshots.forEach((doc) => {
          const data = doc.data() as AppointmentData;
          if (data.deleted || (data.date && isBefore(data.date.toDate(), today))) {
            fetchedAppointments.push({ ...data, id: doc.id });
          }
        });
        
        // Sort by most recent first
        fetchedAppointments.sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());

        setPastAppointments(fetchedAppointments);
      } catch (e: any) {
        console.error("Error fetching past appointments:", e);
        setError("Could not load past appointments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, isUserLoading, userDocRef]);


  return (
    <div className="w-full max-w-4xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="past-appointments" className="border-none">
          <AccordionTrigger className="flex justify-center text-primary hover:no-underline">
            <div className="flex items-center gap-2 text-lg">
              <Archive className="h-6 w-6" />
              <span>View Past Appointments</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-6">
              {isLoading ? (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="ml-2">Loading history...</p>
                </div>
              ) : error ? (
                <p className="text-center text-destructive">{error}</p>
              ) : pastAppointments.length > 0 ? (
                pastAppointments.map(apt => (
                  <Card key={apt.id} className={`bg-card/75 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${apt.deleted ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4 flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{apt.specificService}</CardTitle>
                        <CardDescription className="text-foreground/80">
                          {apt.bankName} - {format(apt.date.toDate(), 'PPP')}
                        </CardDescription>
                      </div>
                      {apt.deleted && (
                          <div className="text-sm font-bold text-destructive">CANCELLED</div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-foreground mt-4">
                  You have no past appointments.
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
