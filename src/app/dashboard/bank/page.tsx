'use client';

import Greeting from '@/components/greeting';
import BankUpcomingAppointments from '@/components/bank-upcoming-appointments';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import BankPastAppointments from '@/components/bank-past-appointments';

export default function BankDashboardPage() {
  return (
    <div className="w-full">
      <Greeting />
      <BankUpcomingAppointments />
      <div className="mt-12 flex flex-col md:flex-row justify-center gap-8">
        <Button
          asChild
          className="bg-card text-primary font-bold py-6 px-12 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
        >
          <Link href="/dashboard/bank/document-checklist">Document Checklist</Link>
        </Button>
        <Button
          asChild
          className="bg-card text-primary font-bold py-6 px-12 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
        >
          <Link href="/dashboard/bank/appointment-scheduling">Appointment Scheduling</Link>
        </Button>
      </div>
      <div className="mt-8">
        <BankPastAppointments />
      </div>
    </div>
  );
}
