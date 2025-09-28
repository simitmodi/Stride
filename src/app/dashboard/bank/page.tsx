
'use client';

import Greeting from '@/components/greeting';
import {
  Bell,
  Calendar as CalendarIcon,
} from 'lucide-react';
import {
  addDays,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

// Dummy data for appointments, to be replaced with real data later
const dummyAppointments = [
  {
    id: '1',
    customerName: 'Simit Modi',
    date: '05/06/2025',
    time: '5:30',
  },
  {
    id: '2',
    customerName: 'Ankit Nandoliya',
    date: '9/6/2025',
    time: '4:50',
  },
];


export default function BankDashboardPage() {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [days, setDays] = useState<Date[]>([]);
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Assuming week starts on Monday
    setDays(Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)));
  }, [selectedDate]);

  return (
    <div className="w-full" style={{ backgroundColor: '#BFBAB0' }}>
      <div className="flex flex-col items-center">
        <Greeting />
        <div className="w-full max-w-4xl mx-auto">
          <Card className="bg-card shadow-lg rounded-lg mb-8">
            <CardContent className="p-4">
              <div className="flex justify-between items-center gap-4">
                 <div className="flex justify-between flex-grow overflow-x-auto">
                  {days.map((day) => {
                    const dayIsSelected = isSameDay(day, selectedDate);
                    return (
                      <Button
                        key={day.toString()}
                        variant={dayIsSelected ? 'default' : 'ghost'}
                        className={`relative flex flex-col h-16 w-16 rounded-lg p-2 transition-all duration-200 justify-center items-center
                          ${dayIsSelected ? 'bg-[#092910] text-white' : ''}
                          border border-transparent`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <span className="text-sm uppercase">
                          {format(day, 'eee')}
                        </span>
                        <span className="text-2xl font-bold">
                          {format(day, 'd')}
                        </span>
                      </Button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="h-16 rounded-lg"
                    onClick={() => setSelectedDate(startOfDay(new Date()))}
                  >
                    Today
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-12 w-12 rounded-full p-0 flex justify-center items-center"
                      >
                        <CalendarIcon className="h-6 w-6" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
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
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
               <Bell className="h-6 w-6" style={{ color: '#092910' }} />
               <h2 className="text-2xl font-bold" style={{ color: '#092910' }}>
                 Upcoming
               </h2>
            </div>
             <p className="mb-4" style={{ color: '#092910' }}>Customer Slots</p>
             <div className="space-y-4">
                {dummyAppointments.map((apt) => (
                  <Card key={apt.id} style={{ backgroundColor: '#D0CBC1' }} className="shadow-md">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg" style={{ color: '#092910' }}>{apt.customerName}</p>
                        <p className="text-sm" style={{ color: '#092910' }}>{apt.date}, {apt.time}</p>
                      </div>
                      <Button style={{ backgroundColor: '#092910', color: 'white' }}>More</Button>
                    </CardContent>
                  </Card>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
