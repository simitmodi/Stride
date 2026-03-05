"use client";

import { useState, useEffect, useMemo } from "react";
import { format, isSameDay, startOfDay, isAfter } from "date-fns";
import { Loader2, CalendarDays, FileText, CalendarPlus } from "lucide-react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { doc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
import { CustomerAppointmentDetailsModal } from "./customer-appointment-details-modal";
import { AppointmentCard } from "./appointment-card";
import ShinyText from "./ShinyText";
import ThreeMonthCalendar from "./three-month-calendar";

const INDIGO = "#4F46E5";

export interface AppointmentData {
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

export default function UpcomingAppointments({ calendarJumpDate }: { calendarJumpDate?: Date | null }) {
  const todayDate = useMemo(() => startOfDay(new Date()), []);

  // Calendar-controlled state (lifted up here)
  const [selectedDate, setSelectedDate] = useState<Date>(todayDate);
  const [calendarMonth, setCalendarMonth] = useState(todayDate.getMonth());
  const [calendarYear, setCalendarYear] = useState(todayDate.getFullYear());

  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);

  const { user } = useUser();
  const firestore = useFirestore();
  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [user, firestore]
  );
  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (isUserDocLoading || !user) return;
      setIsLoading(true);
      setError(null);
      const appointmentIds = userData?.appointmentIds;
      if (!appointmentIds || appointmentIds.length === 0) {
        setAppointments([]);
        setIsLoading(false);
        return;
      }
      try {
        const q = query(collection(firestore, "appointments"), where("__name__", "in", appointmentIds));
        const snapshots = await getDocs(q);
        const fetched: AppointmentData[] = [];
        snapshots.forEach((doc) => {
          const data = doc.data();
          if (data.date?.toDate && !data.deleted) fetched.push({ id: doc.id, ...data } as AppointmentData);
        });
        fetched.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());
        setAppointments(fetched);
      } catch {
        setError("Could not load appointments.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [user, userData, isUserDocLoading, firestore]);

  const handleUpdate = (updated: AppointmentData) =>
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));

  const handleCancel = (id: string) =>
    setAppointments((prev) => prev.filter((a) => a.id !== id));

  // Appointments for the currently selected date
  const selectedDateAppointments = useMemo(
    () => appointments.filter((apt) => isSameDay(apt.date.toDate(), selectedDate)),
    [appointments, selectedDate]
  );

  // All OTHER upcoming appointments (not on selected date, not in the past)
  const otherUpcoming = useMemo(() => {
    return appointments.filter((apt) => {
      const d = startOfDay(apt.date.toDate());
      return !isAfter(todayDate, d) && !isSameDay(d, selectedDate);
    });
  }, [appointments, selectedDate, todayDate]);

  // Jump calendar to a date and select it
  const jumpToDate = (date: Date) => {
    setCalendarMonth(date.getMonth());
    setCalendarYear(date.getFullYear());
    setSelectedDate(date);
  };

  // External jump trigger (from parent — e.g. "Next up" click)
  useEffect(() => {
    if (calendarJumpDate) jumpToDate(startOfDay(calendarJumpDate));
  }, [calendarJumpDate]);

  if (isLoading || isUserDocLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: INDIGO }} />
        <p className="ml-4 text-slate-500">Loading appointments…</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* ── 1. Calendar Container ── */}
      <div className="rounded-2xl bg-white shadow-sm border border-[#e2e8f0] overflow-hidden relative z-10">
        <ThreeMonthCalendar
          appointments={appointments}
          selectedDate={selectedDate}
          centerMonth={calendarMonth}
          centerYear={calendarYear}
          onCenterChange={(m, y) => { setCalendarMonth(m); setCalendarYear(y); }}
          onSelectDate={(d) => setSelectedDate(d)}
          onAppointmentClick={(apt) => setSelectedAppointment(apt)}
          standalone={false}
        />
      </div>

      {/* ── 2. Daily View Container ── */}
      <div className="p-6 md:p-8 rounded-2xl bg-white shadow-sm border border-[#e2e8f0] relative z-10">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
              <CalendarDays className="h-6 w-6" style={{ color: INDIGO }} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              <ShinyText
                text={`Appointments for ${format(selectedDate, "MMMM d, yyyy")}`}
                disabled={false}
                speed={3}
                className="font-bold"
              />
            </h2>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center mb-6">
              {error}
            </div>
          )}

          {selectedDateAppointments.length === 0 ? (
            <div
              key={selectedDate.toISOString()}
              className="group relative overflow-hidden flex flex-col md:flex-row items-center gap-6 p-8 rounded-2xl bg-white border border-[#e2e8f0] hover:bg-slate-50/50 transition-all duration-300"
            >
              {/* Icon Container */}
              <div className="relative flex-shrink-0">
                <div className="relative w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={INDIGO} strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Schedule is clear</h3>
                <p className="text-slate-400 text-sm font-medium max-w-sm leading-relaxed">No appointments booked for this day. Ready to fill your schedule?</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 relative z-10">
                <a href="/dashboard/customer/document-checklist"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95 shadow-sm">
                  <FileText className="h-4 w-4" />
                  Docs
                </a>
                <a href="/dashboard/customer/appointment-scheduling"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white transition-all active:scale-95 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: INDIGO }}>
                  <CalendarPlus className="h-4 w-4" />
                  Book New
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateAppointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} onCardClick={() => setSelectedAppointment(apt)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedAppointment && (
        <CustomerAppointmentDetailsModal
          appointment={selectedAppointment}
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onAppointmentUpdate={handleUpdate}
          onAppointmentCancel={handleCancel}
        />
      )}
    </div>
  );
}

