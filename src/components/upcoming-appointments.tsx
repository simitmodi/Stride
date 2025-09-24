
"use client";

import { useMemo, useState, useEffect } from "react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useUser, useMemoFirebase } from "@/firebase/provider";
import { collection, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  addDays,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
  isToday,
  isFuture,
} from "date-fns";
import { Button } from "./ui/button";
import { Calendar as CalendarIcon, Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Card, CardContent } from "./ui/card";
import { Calendar } from "./ui/calendar";

export default function UpcomingAppointments() {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [days, setDays] = useState<Date[]>([]);
  const [month, setMonth] = useState(new Date());

  const appointmentsQuery = useMemoFirebase(
    () =>
      user
        ? query(
            collection(db, `users/${user.uid}/appointments`),
            orderBy('date', 'asc')
          )
        : null,
    [user]
  );
  const { data: allAppointments, isLoading } = useCollection(appointmentsQuery);

  useEffect(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    setDays(Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)));
  }, [selectedDate]);

  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, any[]>();
    if (allAppointments) {
      allAppointments.forEach((apt) => {
        if (apt.date && apt.date.toDate) {
          const dateStr = format(apt.date.toDate(), "yyyy-MM-dd");
          if (!map.has(dateStr)) {
            map.set(dateStr, []);
          }
          map.get(dateStr)?.push(apt);
        }
      });
    }
    return map;
  }, [allAppointments]);

  const appointmentsToList = useMemo(() => {
    if (!allAppointments) return [];
    if (isToday(selectedDate)) {
      // If today is selected, show all future appointments
      return allAppointments.filter(
        (apt) =>
          apt.date &&
          apt.date.toDate &&
          (isToday(apt.date.toDate()) || isFuture(apt.date.toDate()))
      ).sort((a,b) => a.date.toDate() - b.date.toDate());
    }
    // Otherwise, show appointments only for the selected day
    return allAppointments.filter(
      (apt) =>
        apt.date &&
        apt.date.toDate &&
        isSameDay(apt.date.toDate(), selectedDate)
    ).sort((a,b) => a.date.toDate() - b.date.toDate());
  }, [selectedDate, allAppointments]);

  const headingText = isToday(selectedDate)
    ? "Upcoming Appointments"
    : `Appointments for ${format(selectedDate, "PPP")}`;
  
  if (days.length === 0) {
    return null; 
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-card shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
        <CardContent className="p-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex justify-between flex-grow">
              {days.map((day) => {
                const dayIsToday = isSameDay(day, startOfDay(new Date()));
                const dayIsSelected = isSameDay(day, selectedDate);
                const hasAppointment = appointmentsByDay.has(
                  format(day, "yyyy-MM-dd")
                );

                return (
                  <Button
                    key={day.toString()}
                    variant="ghost"
                    className={`flex flex-col h-16 w-16 rounded-lg p-2 transition-all duration-200 justify-center items-center
                      ${dayIsToday ? 'bg-primary text-primary-foreground' : ''} 
                      ${dayIsSelected && !dayIsToday ? 'ring-2 ring-primary' : ''}
                      ${!dayIsSelected && hasAppointment && !dayIsToday ? 'border border-primary/50' : 'border border-transparent'}`}
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
                    fromYear={1924}
                    toYear={new Date().getFullYear()}
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
        {isLoading ? (
          <p>Loading appointments...</p>
        ) : (
          <div className="space-y-4">
            {appointmentsToList && appointmentsToList.length > 0 ? (
              appointmentsToList.map((apt) => (
                <Card
                  key={apt.id}
                  className="bg-card/50 border-primary/20"
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{apt.title}</h3>
                      <p className="text-sm">
                        {apt.date && apt.date.toDate ? format(apt.date.toDate(), "PPP p") : 'Date not available'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {apt.location}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-foreground mt-8">
                Your schedule is clear. Book an appointment to get started.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
