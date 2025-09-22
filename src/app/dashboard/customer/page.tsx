"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function CustomerDashboardPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  useEffect(() => {
    setDate(new Date());
  }, []);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">My Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Visits</CardTitle>
            <CardDescription>Your scheduled appointments with the bank.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You have no upcoming visits scheduled.
            </p>
          </CardContent>
        </Card>
        <Card className="flex justify-center items-center p-0 overflow-hidden">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className=""
          />
        </Card>
      </div>
    </>
  );
}
