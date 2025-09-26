"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Archive } from "lucide-react";

export default function PastAppointments() {
  // Since Firestore is removed, this component will now just be a placeholder.
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
              <p className="text-center text-foreground mt-4">
                You have no past appointments.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}