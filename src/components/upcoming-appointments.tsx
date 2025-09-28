
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
  addHours,
  isSaturday,
  isSunday,
} from "date-fns";
import { Button } from "./ui/button";
import {
  Calendar as CalendarIcon,
  Bell,
  Loader2,
  Pencil,
  Trash2,
  Clock,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Calendar } from "./ui/calendar";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
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
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";


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

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentData | null>(null);
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);


  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

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

  const handleDelete = async (appointmentId: string) => {
    if (!user) return;
    setIsDeleting(appointmentId);
    try {
      const appointmentDocRef = doc(firestore, "appointments", appointmentId);
      await updateDoc(appointmentDocRef, {
        deleted: true
      });
      
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

  const isBankHoliday = (date: Date) => {
    if (isSunday(date)) {
      return true; // All Sundays are holidays
    }
    if (isSaturday(date)) {
      const dayOfMonth = date.getDate();
      // Second Saturday (day 8-14) or Fourth Saturday (day 22-28)
      if ((dayOfMonth > 7 && dayOfMonth <= 14) || (dayOfMonth > 21 && dayOfMonth <= 28)) {
        return true;
      }
    }
    return false;
  };

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 10; i < 16; i++) {
        if (i === 14) continue;
  
        const formatHour12 = (hour: number) => {
            const h = hour % 12 === 0 ? 12 : hour % 12;
            return h < 10 ? `0${h}` : h.toString();
        };
  
        const getAmPm = (hour: number) => (hour < 12 ? 'AM' : 'PM');
  
        const startHour = i;
        const endHour = i;
        const startMinutes = '00';
        const endMinutes = '30';
  
        const startAmPm = getAmPm(startHour);
        const endAmPm = getAmPm(endHour);
  
        slots.push(`${formatHour12(startHour)}:${startMinutes} ${startAmPm} - ${formatHour12(endHour)}:${endMinutes} ${endAmPm}`);
  
        if (i < 15) { 
            if (i === 13) continue;

            const nextStartHour = i + 1;
            const nextStartMinutes = '00';
            const nextStartAmPm = getAmPm(nextStartHour);
  
            slots.push(`${formatHour12(endHour)}:${endMinutes} ${endAmPm} - ${formatHour12(nextStartHour)}:${nextStartMinutes} ${nextStartAmPm}`);
        }
    }
    return slots;
  }, []);

  const handleEditClick = (appointment: AppointmentData) => {
    setEditingAppointment(appointment);
    setNewTime(appointment.time);
    setNewDate(appointment.date.toDate());
    setIsEditDialogOpen(true);
  };

  const handleUpdateAppointment = async () => {
    if (!editingAppointment || !newTime || !newDate) return;
    setIsUpdating(true);
    try {
      const appointmentDocRef = doc(firestore, "appointments", editingAppointment.id);
      await updateDoc(appointmentDocRef, {
        time: newTime,
        date: Timestamp.fromDate(newDate)
      });

      // Update local state to reflect the change immediately
      setAppointments(prev => prev.map(apt => 
        apt.id === editingAppointment.id ? { ...apt, time: newTime, date: Timestamp.fromDate(newDate) } : apt
      ));
      
      toast({
        title: "Appointment Updated",
        description: "Your appointment time has been successfully changed.",
      });
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating appointment:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update the appointment.",
      });
    } finally {
      setIsUpdating(false);
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
                onClick={() => handleEditClick(appointment)}
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
            <AppointmentCard key={apt.id} appointment={apt} />
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

       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card/95" style={{ backdropFilter: 'blur(12px)' }}>
            <DialogHeader>
            <DialogTitle className="text-primary">Edit Appointment</DialogTitle>
            <DialogDescription style={{ color: '#000F00' }}>
                Select a new date and time for your appointment.
            </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="space-y-2">
                    <Label style={{ color: '#000F00' }}>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !newDate && 'text-foreground/80'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newDate ? format(newDate, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newDate}
                            onSelect={setNewDate}
                            initialFocus
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01") || isBankHoliday(date)}
                          />
                        </PopoverContent>
                      </Popover>
                </div>
                <div className="space-y-2">
                    <Label style={{ color: '#000F00' }}>Time</Label>
                    <Select onValueChange={setNewTime} defaultValue={newTime}>
                        <SelectTrigger>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Select a new time slot" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                    {slot}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleUpdateAppointment} disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    </div>
  );
}
