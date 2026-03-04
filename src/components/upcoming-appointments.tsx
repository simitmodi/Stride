"use client";

import { useState, useEffect, useMemo } from "react";
import { format, isSameDay, startOfDay, isAfter } from "date-fns";
import { Loader2, CalendarDays } from "lucide-react";
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
    <div className="w-full px-4 md:px-8">
      {/* ── Full-width calendar ── */}
      <ThreeMonthCalendar
        appointments={appointments}
        selectedDate={selectedDate}
        centerMonth={calendarMonth}
        centerYear={calendarYear}
        onCenterChange={(m, y) => { setCalendarMonth(m); setCalendarYear(y); }}
        onSelectDate={(d) => setSelectedDate(d)}
        onAppointmentClick={(apt) => setSelectedAppointment(apt)}
      />

      {/* ── Appointments for selected date ── */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-6">
          <CalendarDays className="h-8 w-8 flex-shrink-0" style={{ color: INDIGO }} />
          <h2 className="text-4xl font-bold leading-tight">
            <ShinyText
              text={`Appointments for ${format(selectedDate, "MMMM d, yyyy")}`}
              disabled={false}
              speed={3}
              className="custom-class"
            />
          </h2>
        </div>

        {error && <p className="text-destructive text-center mb-4">{error}</p>}

        {selectedDateAppointments.length === 0 ? (
          <div
            key={selectedDate.toISOString()}
            className="relative overflow-hidden flex items-center gap-4 px-5 py-4 rounded-2xl"
            style={{ background: `linear-gradient(145deg, ${INDIGO}08, ${INDIGO}04)`, border: `1px solid ${INDIGO}18` }}
          >
            <style>{`
              @keyframes vaultPop { 0%{opacity:0;transform:scale(0.6) rotate(-10deg)} 70%{transform:scale(1.1) rotate(3deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
              @keyframes esSlide  { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
              @keyframes esBtnIn  { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
              @keyframes esShimmer { 0%{opacity:0.05} 50%{opacity:0.12} 100%{opacity:0.05} }
              .es3-vault { animation: vaultPop  0.5s cubic-bezier(.34,1.56,.64,1) 0.05s both; }
              .es3-text  { animation: esSlide   0.35s ease-out 0.4s both; }
              .es3-btn1  { animation: esBtnIn   0.3s cubic-bezier(.34,1.56,.64,1) 0.55s both; }
              .es3-btn2  { animation: esBtnIn   0.3s cubic-bezier(.34,1.56,.64,1) 0.68s both; }
              .es3-glow  { animation: esShimmer 3s ease-in-out infinite; }
            `}</style>

            {/* shimmer bg */}
            <div className="es3-glow absolute -top-6 -right-6 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${INDIGO}35, transparent 70%)` }} />

            {/* Vault icon */}
            <div className="es3-vault flex-shrink-0">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <rect x="4" y="4" width="36" height="36" rx="8" fill={`${INDIGO}12`} stroke={INDIGO} strokeWidth="1.5" />
                <circle cx="22" cy="22" r="11" stroke={INDIGO} strokeWidth="1.5" fill={`${INDIGO}08`} />
                <circle cx="22" cy="22" r="6" stroke={`${INDIGO}70`} strokeWidth="1.2" fill={`${INDIGO}12`} />
                <circle cx="22" cy="22" r="2.5" fill={INDIGO} />
                <line x1="22" y1="11" x2="22" y2="16" stroke={INDIGO} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="22" y1="28" x2="22" y2="33" stroke={INDIGO} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="11" y1="22" x2="16" y2="22" stroke={INDIGO} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="28" y1="22" x2="33" y2="22" stroke={INDIGO} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Text */}
            <div className="es3-text flex-1 min-w-0">
              <p className="text-sm font-black" style={{ color: INDIGO }}>Schedule is clear</p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">Nothing booked — ready when you are.</p>
            </div>

            {/* CTAs */}
            <div className="flex gap-2 flex-shrink-0">
              <a href="/dashboard/customer/document-checklist"
                className="es3-btn1 flex items-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ border: `1.5px solid ${INDIGO}`, color: INDIGO, background: "white" }}>
                <svg width="11" height="11" viewBox="0 0 15 15" fill="none"><rect x="2" y="1" width="11" height="13" rx="2" stroke={INDIGO} strokeWidth="1.4" /><line x1="5" y1="5" x2="10" y2="5" stroke={INDIGO} strokeWidth="1.2" strokeLinecap="round" /><line x1="5" y1="8" x2="10" y2="8" stroke={INDIGO} strokeWidth="1.2" strokeLinecap="round" /></svg>
                Docs
              </a>
              <a href="/dashboard/customer/appointment-scheduling"
                className="es3-btn2 flex items-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: INDIGO, boxShadow: `0 3px 12px ${INDIGO}40` }}>
                <svg width="11" height="11" viewBox="0 0 15 15" fill="none"><rect x="1" y="3" width="13" height="11" rx="2" stroke="white" strokeWidth="1.4" /><line x1="1" y1="7" x2="14" y2="7" stroke="white" strokeWidth="1.2" /><line x1="5" y1="1" x2="5" y2="5" stroke="white" strokeWidth="1.4" strokeLinecap="round" /><line x1="10" y1="1" x2="10" y2="5" stroke="white" strokeWidth="1.4" strokeLinecap="round" /></svg>
                Book
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


// Stride: Professional Financial Connectivity
