
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  addDays,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
  isToday,
  parse,
  isAfter,
} from "date-fns";
import { Button } from "./ui/button";
import {
  Calendar as CalendarIcon,
  Bell,
  Loader2,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { Card, CardContent } from "./ui/card";
import { Calendar } from "./ui/calendar";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
import { CustomerAppointmentDetailsModal } from "./customer-appointment-details-modal";
import { AppointmentCard } from "./appointment-card";
import ShinyText from "./ShinyText";

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

export default function UpcomingAppointments() {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [days, setDays] = useState<Date[]>([]);
  const [month, setMonth] = useState(new Date());

  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [user, firestore]
  );
  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  useEffect(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    setDays(Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)));
  }, [selectedDate]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (isUserDocLoading || !user) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      const appointmentIds = userData?.appointmentIds;
      if (!appointmentIds || appointmentIds.length === 0) {
        setAppointments([]);
        setIsLoading(false);
        return;
      }

      try {
        const appointmentsRef = collection(firestore, "appointments");
        const q = query(appointmentsRef, where('__name__', 'in', appointmentIds));
        const appointmentSnapshots = await getDocs(q);
        
        const fetchedAppointments: AppointmentData[] = [];
        appointmentSnapshots.forEach((doc) => {
          const data = doc.data();
          if(data.date && data.date.toDate && !data.deleted) {
            fetchedAppointments.push({ id: doc.id, ...data } as AppointmentData);
          }
        });
        
        fetchedAppointments.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());
        setAppointments(fetchedAppointments);
      } catch (e: any) {
        console.error("Error fetching appointments:", e);
        setError("Could not load appointments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, userData, isUserDocLoading, firestore]);
  
  const handleAppointmentUpdate = (updatedAppointment: AppointmentData) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === updatedAppointment.id ? updatedAppointment : apt
    ));
  };
  
  const handleAppointmentCancel = (appointmentId: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
  };


  const renderGroupedAppointments = (appointmentsToGroup: AppointmentData[]) => {
    const today = startOfDay(new Date());
    const upcomingAppointments = appointmentsToGroup.filter(apt => !isAfter(today, startOfDay(apt.date.toDate())));
  
    if (upcomingAppointments.length === 0) {
      return (
        <p className="text-center text-foreground mt-8">
          No upcoming appointments scheduled.
        </p>
      );
    }
  
    const grouped = upcomingAppointments.reduce((acc, apt) => {
      const dateKey = format(apt.date.toDate(), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(apt);
      return acc;
    }, {} as Record<string, AppointmentData[]>);
  
    return Object.keys(grouped).sort().map(dateKey => (
      <div key={dateKey} className="mb-6">
        <h3 className="text-xl font-semibold text-primary/80 mb-3">{format(parse(dateKey, 'yyyy-MM-dd', new Date()), 'EEEE, MMMM do')}</h3>
        <div className="space-y-4">
          {grouped[dateKey].map((apt) => (
            <AppointmentCard key={apt.id} appointment={apt} onCardClick={() => setSelectedAppointment(apt)} />
          ))}
        </div>
      </div>
    ));
  };
  
  const renderAppointmentContent = () => {
    if (isLoading || isUserDocLoading) {
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
    
    if (isToday(selectedDate)) {
      return renderGroupedAppointments(appointments);
    } else {
      const filteredAppointments = appointments.filter((apt) => isSameDay(apt.date.toDate(), selectedDate));
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
             <AppointmentCard key={apt.id} appointment={apt} onCardClick={() => setSelectedAppointment(apt)} />
          ))}
        </div>
      );
    }
  };

  const headingText = isToday(selectedDate)
    ? "Upcoming Appointments"
    : `Appointments for ${format(selectedDate, "PPP")}`;
  
  if (days.length === 0 && (isLoading || isUserDocLoading)) {
    return (
        <div className="w-full max-w-4xl mx-auto">
             <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
        </div>
    ); 
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-card shadow-lg rounded-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-100">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex justify-between items-center flex-grow overflow-x-auto w-full md:w-auto py-4 px-2">
              {days.map((day) => {
                const dayIsToday = isSameDay(day, startOfDay(new Date()));
                const dayIsSelected = isSameDay(day, selectedDate);

                return (
                  <Button
                    key={day.toString()}
                    variant="ghost"
                    className={`relative flex flex-col h-16 w-16 rounded-lg p-2 transition-all duration-300 justify-center items-center shrink-0
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
                className="h-16 rounded-lg transition-all duration-300"
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
          <ShinyText text={headingText} disabled={false} speed={3} className="custom-class" />
        </h2>
        {renderAppointmentContent()}
      </div>

       {selectedAppointment && (
        <CustomerAppointmentDetailsModal
          appointment={selectedAppointment}
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onAppointmentUpdate={handleAppointmentUpdate}
          onAppointmentCancel={handleAppointmentCancel}
        />
      )}
    </div>
  );
}
