
"use client";

import { useState, useEffect } from "react";
import {
  addDays,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
  isToday,
} from "date-fns";
import { Button } from "./ui/button";
import { Calendar as CalendarIcon, Bell, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Card, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Calendar } from "./ui/calendar";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

interface AppointmentData {
  id: string;
  customAppointmentId: string;
  bankName: string;
  branch: string;
  date: Timestamp;
  time: string;
  serviceCategory: string;
  specificService: string;
}

export default function UpcomingAppointments() {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [days, setDays] = useState<Date[]>([]);
  const [month, setMonth] = useState(new Date());

  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [user, firestore]
  );
  
  useEffect(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    setDays(Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)));
  }, [selectedDate]);

  useEffect(() => {
    if (!userDocRef) {
      if(!isUserLoading) setIsLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const appointmentIds = userData.appointmentIds;

          if (appointmentIds && appointmentIds.length > 0) {
            const appointmentsRef = collection(firestore, "appointments");
            // Firestore 'in' queries are limited to 30 items. 
            // If you expect more, you'll need to batch the requests.
            const q = query(appointmentsRef, where('__name__', 'in', appointmentIds));
            const appointmentSnapshots = await getDocs(q);
            
            const fetchedAppointments: AppointmentData[] = [];
            appointmentSnapshots.forEach((doc) => {
              fetchedAppointments.push({ id: doc.id, ...doc.data() } as AppointmentData);
            });
             
            setAppointments(fetchedAppointments);
          } else {
            // User has no appointments
            setAppointments([]);
          }
        } else {
           // User document doesn't exist
           setAppointments([]);
        }
      } catch (e: any) {
        console.error("Error fetching appointments:", e);
        setError("Could not load appointments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [userDocRef, firestore]);

  const filteredAppointments = appointments
    .filter((apt) => isSameDay(apt.date.toDate(), selectedDate))
    .sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());
  
  const headingText = isToday(selectedDate)
    ? "Upcoming Appointments"
    : `Appointments for ${format(selectedDate, "PPP")}`;
  
  if (days.length === 0) {
    return null; 
  }

  const renderAppointmentContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4">Loading your appointments...</p>
        </div>
      );
    }

    if (error) {
       return (
         <p className="text-center text-destructive mt-8">{error}</p>
       );
    }
    
    if (filteredAppointments.length === 0) {
      return (
        <p className="text-center text-foreground mt-8">
          No appointments scheduled for this day.
        </p>
      );
    }

    return (
      <div className="space-y-4">
        {filteredAppointments.map((apt) => (
          <Card key={apt.id} className="bg-card/75 transition-shadow hover:shadow-md">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">{apt.specificService}</CardTitle>
                <CardDescription className="text-foreground/80">
                  {apt.bankName} - {apt.branch}
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="font-semibold">{apt.time}</p>
                <p className="text-sm text-foreground/80">ID: {apt.customAppointmentId}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };


  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-card shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-100">
        <CardContent className="p-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex justify-between flex-grow">
              {days.map((day) => {
                const dayIsToday = isSameDay(day, startOfDay(new Date()));
                const dayIsSelected = isSameDay(day, selectedDate);

                return (
                  <Button
                    key={day.toString()}
                    variant="ghost"
                    className={`relative flex flex-col h-16 w-16 rounded-lg p-2 transition-all duration-200 justify-center items-center
                      ${dayIsToday ? 'bg-primary text-primary-foreground' : ''} 
                      ${dayIsSelected && !dayIsToday ? 'ring-2 ring-primary' : ''}
                      border border-transparent`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <span className="text-sm uppercase">
                      {format(day, "eee")}
                    </span>
                    <span className="text-2xl font-bold">
                      {format(day, "d")}
                    </span>
                  </Button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost"
                className="h-16 rounded-lg transition-all duration-200"
                onClick={() => setSelectedDate(startOfDay(new Date()))}
              >
                Today
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-12 w-12 rounded-full p-0 flex justify-center items-center">
                    <CalendarIcon className="h-6 w-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card/75" style={{ backdropFilter: 'blur(12px)' }}>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => {
                      const newDate = d ? startOfDay(d) : startOfDay(new Date());
                      setSelectedDate(newDate);
                      setMonth(newDate);
                    }}
                    month={month}
                    onMonthChange={setMonth}
                    captionLayout="dropdown-buttons"
                    fromYear={new Date().getFullYear()}
                    toYear={new Date().getFullYear() + 1}
                    disabled={(date) => date < startOfDay(new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2 mb-4">
          <Bell className="h-6 w-6" />
          {headingText}
        </h2>
        {renderAppointmentContent()}
      </div>
    </div>
  );
}
