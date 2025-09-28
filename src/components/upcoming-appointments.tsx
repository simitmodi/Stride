
"use client";

import { useState, useEffect } from "react";
import {
  addDays,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
  isToday,
  parse,
  isAfter,
  addHours,
} from "date-fns";
import { Button } from "./ui/button";
import {
  Calendar as CalendarIcon,
  Bell,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Card, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Calendar } from "./ui/calendar";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";


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
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    setDays(Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)));
  }, [selectedDate]);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchUserAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userDocRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const appointmentIds = userData.appointmentIds;

          if (appointmentIds && appointmentIds.length > 0) {
            const appointmentsRef = collection(firestore, "appointments");
            const q = query(appointmentsRef, where('__name__', 'in', appointmentIds));
            const appointmentSnapshots = await getDocs(q);
            
            const fetchedAppointments: AppointmentData[] = [];
            appointmentSnapshots.forEach((doc) => {
              const data = doc.data();
              // Filter out soft-deleted appointments
              if(data.date && data.date.toDate && !data.deleted) {
                fetchedAppointments.push({ id: doc.id, ...data } as AppointmentData);
              }
            });
            
            fetchedAppointments.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());
            setAppointments(fetchedAppointments);
          } else {
            setAppointments([]);
          }
        } else {
           setAppointments([]);
        }
      } catch (e: any) {
        console.error("Error fetching appointments:", e);
        setError("Could not load appointments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAppointments();
  }, [user, firestore, isUserLoading]);

  const handleDelete = async (appointmentId: string) => {
    if (!user) return;
    setIsDeleting(appointmentId);
    try {
      // Instead of deleting, update the document with a 'deleted' flag
      const appointmentDocRef = doc(firestore, "appointments", appointmentId);
      await updateDoc(appointmentDocRef, {
        deleted: true
      });
      
      // Remove the appointment from the local state to update the UI
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });

    } catch (error: any) {
      console.error("Error cancelling appointment:", error);
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: error.message || "Could not cancel the appointment.",
      });
    } finally {
      setIsDeleting(null);
    }
  };


  const AppointmentCard = ({ appointment }: { appointment: AppointmentData }) => {
    const appointmentDate = appointment.date.toDate();
    const timeSlotStartStr = appointment.time.split(' - ')[0];
    const appointmentDateTime = parse(
      `${format(appointmentDate, 'yyyy-MM-dd')} ${timeSlotStartStr}`,
      'yyyy-MM-dd h:mm a',
      new Date()
    );

    const now = new Date();
    const twelveHoursFromNow = addHours(now, 12);
    const isActionable = isAfter(appointmentDateTime, twelveHoursFromNow);

    return (
      <Card className="bg-card/75 transition-shadow hover:shadow-md">
        <CardContent className="p-4 flex justify-between items-center gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">{appointment.specificService}</CardTitle>
            <CardDescription className="text-foreground/80">
              {appointment.bankName} - {appointment.branch}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="font-semibold">{appointment.time}</p>
            <p className="text-sm text-foreground/80">ID: {appointment.customAppointmentId}</p>
          </div>
          {isActionable && (
            <div className="flex flex-col sm:flex-row gap-2 border-l border-foreground/20 pl-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9" 
                onClick={() => router.push(`/dashboard/customer/appointment-scheduling?edit=true&appointmentId=${appointment.id}`)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit Appointment</span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="h-9 w-9" disabled={isDeleting === appointment.id}>
                    {isDeleting === appointment.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                    <span className="sr-only">Cancel Appointment</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will cancel your appointment. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Back</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(appointment.id)} className="bg-destructive hover:bg-destructive/90">
                      Yes, Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardContent>
      </Card>
    );
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
            <AppointmentCard key={apt.id} appointment={apt} />
          ))}
        </div>
      </div>
    ));
  };
  
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
            <AppointmentCard key={apt.id} appointment={apt} />
          ))}
        </div>
      );
    }
  };

  const headingText = isToday(selectedDate)
    ? "Upcoming Appointments"
    : `Appointments for ${format(selectedDate, "PPP")}`;
  
  if (days.length === 0 && isLoading) {
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
