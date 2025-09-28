
'use client';

import Greeting from '@/components/greeting';
import { Bell, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { addDays, format, isSameDay, startOfDay, startOfWeek } from 'date-fns';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { AppointmentDetailsModal } from '@/components/appointment-details-modal';

interface Appointment {
  id: string;
  customerName: string;
  date: string;
  time: string;
  originalDate: Date;
}

export default function BankDashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user]
  );
  const { data: bankUserData, isLoading: isBankUserLoading } = useDoc(userDocRef);

  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [days, setDays] = useState<Date[]>([]);
  const [month, setMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    setDays(Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)));
  }, [selectedDate]);

  useEffect(() => {
    if (!bankUserData) return;

    const fetchAppointments = async () => {
      setIsLoading(true);
      const { bankName, branch } = bankUserData;

      if (!bankName || !branch) {
        setIsLoading(false);
        return;
      }

      try {
        const appointmentsRef = collection(firestore, 'appointments');
        const q = query(
          appointmentsRef,
          where('bankName', '==', bankName),
          where('branch', '==', branch)
        );

        const querySnapshot = await getDocs(q);
        const fetchedAppointments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const appointmentsWithCustomerData = await Promise.all(
          fetchedAppointments.map(async (apt) => {
            if (apt.userId) {
              const customerDocRef = doc(firestore, 'users', apt.userId);
              const customerDoc = await getDoc(customerDocRef);
              const customerName = customerDoc.exists()
                ? customerDoc.data().displayName
                : 'Unknown Customer';
              return {
                id: apt.id,
                customerName: customerName,
                date: format(apt.date.toDate(), 'dd/MM/yyyy'),
                time: apt.time,
                originalDate: apt.date.toDate(),
              };
            }
            return null;
          })
        );
        
        const validAppointments = appointmentsWithCustomerData.filter(apt => apt !== null) as Appointment[];
        setAppointments(validAppointments);

      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [bankUserData, firestore]);

  const filteredAppointments = appointments.filter((apt) =>
    isSameDay(apt.originalDate, selectedDate)
  );

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
                          ${
                            dayIsSelected
                              ? 'bg-[#092910] text-white'
                              : ''
                          }
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
                          const newDate = d
                            ? startOfDay(d)
                            : startOfDay(new Date());
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
            <p className="mb-4" style={{ color: '#092910' }}>
              Customer Slots for {format(selectedDate, 'PPP')}
            </p>
            {isLoading || isBankUserLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#092910' }}/>
                 <p className="ml-4" style={{ color: '#092910' }}>Loading appointments...</p>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => (
                  <Card
                    key={apt.id}
                    style={{ backgroundColor: '#D0CBC1' }}
                    className="shadow-md"
                  >
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p
                          className="font-semibold text-lg"
                          style={{ color: '#092910' }}
                        >
                          {apt.customerName}
                        </p>
                        <p className="text-sm" style={{ color: '#092910' }}>
                          {apt.date}, {apt.time}
                        </p>
                      </div>
                      <Button
                        style={{ backgroundColor: '#092910', color: 'white' }}
                        onClick={() => setSelectedAppointmentId(apt.id)}
                      >
                        More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
                <p className="text-center" style={{ color: '#092910' }}>No appointments for this day.</p>
            )}
          </div>
        </div>
      </div>
      {selectedAppointmentId && (
        <AppointmentDetailsModal 
            appointmentId={selectedAppointmentId} 
            isOpen={!!selectedAppointmentId}
            onClose={() => setSelectedAppointmentId(null)}
        />
      )}
    </div>
  );
}
