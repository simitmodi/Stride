
"use client";

import { useMemo, useState, useEffect } from "react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useUser, useMemoFirebase } from "@/firebase/provider";
import { collection } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  addDays,
  format,
  isSameDay,
  startOfDay,
} from "date-fns";
import { Button } from "./ui/button";
import { Calendar as CalendarIcon, Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Card, CardContent } from "./ui/card";
import { Calendar } from "./ui/calendar";

export default function UpcomingAppointments() {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [days, setDays] = useState<Date[]>([]);

  const appointmentsQuery = useMemoFirebase(
    () => (user ? collection(db, `users/${user.uid}/appointments`) : null),
    [user]
  );
  const { data: appointments, isLoading } = useCollection(appointmentsQuery);

  useEffect(() => {
    const start = startOfDay(new Date());
    setDays(Array.from({ length: 7 }).map((_, i) => addDays(start, i)));
  }, []);

  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, any[]>();
    if (appointments) {
      appointments.forEach((apt) => {
        const dateStr = format(apt.date.toDate(), "yyyy-MM-dd");
        if (!map.has(dateStr)) {
          map.set(dateStr, []);
        }
        map.get(dateStr)?.push(apt);
      });
    }
    return map;
  }, [appointments]);
  
  if (days.length === 0) {
    return null; 
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-card/50 border-primary/20 shadow-lg rounded-lg">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              {days.map((day) => {
                const isToday = isSameDay(day, new Date());
                const hasAppointment = appointmentsByDay.has(
                  format(day, "yyyy-MM-dd")
                );
                return (
                  <Button
                    key={day.toString()}
                    variant={isSameDay(day, selectedDate) && !isToday ? "secondary" : "ghost"}
                    className={`flex flex-col h-16 w-16 rounded-lg p-2 transition-all duration-200
                      ${
                        isToday
                          ? "bg-primary text-primary-foreground border-2 border-primary"
                          : "bg-card/30 hover:bg-card/70"
                      }
                      ${
                        isSameDay(day, selectedDate)
                          ? "ring-2 ring-primary"
                          : ""
                      }
                      ${hasAppointment && !isSameDay(day, selectedDate) ? "border-2 border-primary" : ""}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <span className="text-sm">{format(day, "eee")}</span>
                    <span className="text-lg font-bold">
                      {format(day, "d")}
                    </span>
                  </Button>
                );
              })}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-16 w-16">
                  <CalendarIcon className="h-6 w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => setSelectedDate(d || new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2 mb-4">
          <Bell className="h-6 w-6" />
          Upcoming
        </h2>
        {isLoading ? (
          <p>Loading appointments...</p>
        ) : (
          <div className="space-y-4">
            {appointments && appointments.length > 0 ? (
              appointments.map((apt) => (
                <Card
                  key={apt.id}
                  className="bg-card/50 border-primary/20"
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{apt.title}</h3>
                      <p className="text-sm">
                        {format(apt.date.toDate(), "PPP p")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {apt.location}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground mt-8">
                Your schedule is clear. Book an appointment to get started.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
