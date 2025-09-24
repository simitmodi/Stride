
"use client";

import { useMemo } from "react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useUser, useMemoFirebase } from "@/firebase/provider";
import { collection, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { format, isPast } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Archive } from "lucide-react";

export default function PastAppointments() {
  const { user } = useUser();

  const appointmentsQuery = useMemoFirebase(
    () =>
      user
        ? query(
            collection(db, `users/${user.uid}/appointments`),
            where("date", "<", new Date()),
            orderBy("date", "desc")
          )
        : null,
    [user]
  );

  const { data: pastAppointments, isLoading } = useCollection(appointmentsQuery);

  const filteredAppointments = useMemo(() => {
    if (!pastAppointments) return [];
    return pastAppointments.filter(
      (apt) => apt.date && apt.date.toDate && isPast(apt.date.toDate())
    );
  }, [pastAppointments]);

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
            <div className="space-y-4 pt-4">
              {isLoading ? (
                <p>Loading past appointments...</p>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <Card
                    key={apt.id}
                    className="bg-card/50 border-border"
                  >
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{apt.title}</h3>
                        <p className="text-sm">
                          {apt.date && apt.date.toDate
                            ? format(apt.date.toDate(), "PPP p")
                            : "Date not available"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {apt.location}
                        </p>
                      </div>
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
