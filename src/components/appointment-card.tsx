
'use client';

import { Card, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Timestamp } from "firebase/firestore";

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

interface AppointmentCardProps {
    appointment: AppointmentData;
    onCardClick: () => void;
}

export function AppointmentCard({ appointment, onCardClick }: AppointmentCardProps) {
  return (
    <Card 
      className="bg-card/75 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
      onClick={onCardClick}
    >
      <CardContent className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
        <div className="flex-1">
          <CardTitle className="text-lg">{appointment.specificService}</CardTitle>
          <CardDescription className="text-foreground/80">
            {appointment.bankName} - {appointment.branch}
          </CardDescription>
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto">
          <p className="font-semibold">{appointment.time}</p>
          <p className="text-sm text-foreground/80">ID: {appointment.customAppointmentId}</p>
        </div>
      </CardContent>
    </Card>
  );
}

