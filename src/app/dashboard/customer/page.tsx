
"use client";

import Greeting from "@/components/greeting";
import UpcomingAppointments from "@/components/upcoming-appointments";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PastAppointments from "@/components/past-appointments";

export default function CustomerDashboardPage() {
  return (
    <div className="w-full">
      <Greeting />
      <UpcomingAppointments />
      <div className="mt-12 flex flex-col md:flex-row justify-center gap-8">
        <Button
          asChild
          className="bg-card text-primary font-bold py-6 px-12 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
        >
          <Link href="/dashboard/customer/document-checklist">Document Checklist</Link>
        </Button>
        <Button
          asChild
          className="bg-card text-primary font-bold py-6 px-12 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
        >
          <Link href="/dashboard/customer/appointment-scheduling">Appointment Scheduling</Link>
        </Button>
      </div>
      <div className="mt-8">
        <PastAppointments />
      </div>
    </div>
  );
}
