
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
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, where, Timestamp, orderBy } from "firebase/firestore";

interface Appointment {
  id: string;
  bankName: string;
  branch: string;
  date: Timestamp;
  time: string;
  serviceCategory: string;
  specificService: string;
}

export default function UpcomingAppointments() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [days, setDays] = useState<Date[]>([]);
  const [month, setMonth] = useState(new Date());

  const appointmentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, `users/${user.uid}/appointments`),
      where('date', '>=', startOfDay(new Date())),
      orderBy('date'),
      orderBy('time')
    );
  }, [user, firestore]);

  const { data: upcomingAppointments, isLoading, error } = useCollection<Appointment>(appointmentsQuery);
  
  const filteredAppointments = useMemoFirebase(() => {
    if (!upcomingAppointments) return [];
    return upcomingAppointments.filter(apt => isSameDay(apt.date.toDate(), selectedDate));
  }, [upcomingAppointments, selectedDate]);


  useEffect(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    setDays(Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)));
  }, [selectedDate]);

  const headingText = isToday(selectedDate)
    ? "Upcoming Appointments"
    : `Appointments for ${format(selectedDate, "PPP")}`;
  
  if (days.length === 0) {
    return null; 
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
                const hasAppointment = upcomingAppointments?.some(apt => isSameDay(apt.date.toDate(), day));

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
                    {hasAppointment && <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-destructive" />}
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
                    fromYear={1924}
                    toYear={new Date().getFullYear()}
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
        <div className="space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {!isLoading && error && (
                <p className="text-center text-destructive mt-8">
                    Could not load appointments. {error.message}
                </p>
            )}
            {!isLoading && filteredAppointments.length === 0 && (
                <p className="text-center text-foreground mt-8">
                    Your schedule is clear.
                </p>
            )}
            {!isLoading && filteredAppointments.length > 0 && filteredAppointments.map((apt) => (
              <Card key={apt.id} className="bg-card/75 border border-primary/20 shadow-md">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">{apt.time}</CardTitle>
                        <CardDescription className="text-foreground/80">{apt.specificService}</CardDescription>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">{apt.bankName}</p>
                        <p className="text-sm text-foreground/70">{apt.branch}</p>
                    </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
