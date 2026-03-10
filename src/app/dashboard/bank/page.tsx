"use client";

import { useState, useEffect, useMemo } from "react";
import Greeting from "@/components/greeting";
import BankUpcomingAppointments from "@/components/bank-upcoming-appointments";
import Link from "next/link";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { doc, collection, query, where, getDocs, getDoc, Timestamp } from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
import { format, isBefore, startOfDay, isAfter, differenceInSeconds } from "date-fns";
import { CalendarCheck, FileText, ArrowRight, Clock, Landmark, Fingerprint, ChevronUp, ChevronDown } from "lucide-react";
import { registerPasskey, isPasskeySupported } from "@/lib/auth/passkeys";
import { useToast } from "@/hooks/use-toast";
import { AppointmentDetailsModal } from "@/components/appointment-details-modal";
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";
import { motion, AnimatePresence } from "framer-motion";
import { isAppointmentUpcoming } from "@/lib/utils";

const INDIGO = "#4F46E5";

interface AppointmentData {
  id: string;
  customAppointmentId: string;
  customerName?: string;
  bankName: string;
  branch: string;
  date: Timestamp;
  time: string;
  serviceCategory: string;
  specificService: string;
  deleted?: boolean;
}

function QuickActionCard({ icon, label, sub, href, filled }: { icon: React.ReactNode; label: string; sub: string; href: string; filled?: boolean }) {
  return (
    <Link href={href}
      className="flex items-center gap-5 rounded-2xl px-6 py-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
      style={filled
        ? { background: INDIGO, color: "#fff" }
        : { background: "white", border: `2px solid ${INDIGO}20`, color: "#1e293b" }
      }>
      <div className="rounded-2xl p-3.5 flex-shrink-0" style={{ background: filled ? "rgba(255,255,255,0.18)" : `${INDIGO}12` }}>
        <span style={{ color: filled ? "#fff" : INDIGO }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="font-bold text-base" style={{ color: filled ? "#fff" : "#1e293b" }}>{label}</p>
        <p className="text-sm mt-0.5" style={{ color: filled ? "rgba(255,255,255,0.75)" : "#94a3b8" }}>{sub}</p>
      </div>
      <ArrowRight className="ml-auto h-5 w-5 flex-shrink-0 opacity-60 group-hover:translate-x-1 transition-transform" style={{ color: filled ? "#fff" : INDIGO }} />
    </Link>
  );
}

// ── Sleek Digital Countdown ──────────────────────────────────────────────
function DigitalTimer({ days, hrs, mins, sec }: { days: string; hrs: string; mins: string; sec: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-2 px-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-inner">
      <div className="flex items-baseline gap-1.5">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-black tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            {days}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">days</span>
        </div>
        <span className="text-2xl font-light text-white/20 pb-4">:</span>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-black tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            {hrs}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">hrs</span>
        </div>
        <span className="text-2xl font-light text-white/20 pb-4 animate-pulse">:</span>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-black tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            {mins}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">min</span>
        </div>
        <span className="text-2xl font-light text-white/20 pb-4 animate-pulse">:</span>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-black tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            {sec}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">sec</span>
        </div>
      </div>
    </div>
  );
}


// ── Countdown + Stats widget (balanced 3-column) ──────────────────────────────
function CountdownWidget({ nextAppt, upcomingCount, completedCount, onOpen, onRegisterPasskey }: {
  nextAppt: AppointmentData;
  upcomingCount: number;
  completedCount: number;
  onOpen: () => void;
  onRegisterPasskey: () => void;
}) {
  const target = useMemo(() => nextAppt.date.toDate(), [nextAppt]);
  const [secs, setSecs] = useState(() => differenceInSeconds(target, new Date()));

  useEffect(() => {
    const id = setInterval(() => setSecs(differenceInSeconds(target, new Date())), 1000);
    return () => clearInterval(id);
  }, [target]);

  const s = Math.max(0, secs);
  const days = Math.floor(s / 86400);
  const hrs = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="px-4 md:px-8 mb-7">
      <button
        onClick={onOpen}
        className="banner-btn w-full text-left rounded-3xl overflow-hidden relative"
        style={{
          background: `linear-gradient(135deg, ${INDIGO} 0%, #6d28d9 50%, #4338ca 100%)`,
          boxShadow: `0 8px 32px ${INDIGO}40, 0 2px 8px rgba(0,0,0,0.18)`,
        }}
      >
        <style>{`
        .coin-3d   {transform-style: preserve-3d; }
        .floating-bg-object  {filter: blur(40px); opacity: 0.15; }
        .floating-bg-object2 {filter: blur(35px); opacity: 0.12; background: #9333ea; }
        `}</style>

        {/* Floating background objects */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full floating-bg-object pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full floating-bg-object2 pointer-events-none" />

        {/* Shimmer */}
        <div className="pointer-events-none absolute top-0 bottom-0 w-1/3"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", zIndex: 1 }} />

        {/* ── 3-column balanced layout ── */}
        <div className="relative z-10 flex items-stretch divide-x divide-white/10">

          {/* LEFT: Stats */}
          <div className="flex flex-col justify-center items-center gap-3 px-10 py-5 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/40">Overview</p>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black tabular-nums text-white tracking-tighter leading-none">{upcomingCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mt-1">Upcoming</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black tabular-nums text-white/30 tracking-tighter leading-none">{completedCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">Completed</span>
              </div>
            </div>
          </div>

          {/* CENTER: Digital Timer */}
          <div className="flex flex-col justify-center items-center px-10 py-5 flex-1"
            style={{ background: "rgba(0,0,0,0.15)" }}>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/40 mb-4">Next appointment in</p>
            <DigitalTimer days={pad(days)} hrs={pad(hrs)} mins={pad(mins)} sec={pad(sec)} />
          </div>

          {/* RIGHT: Appointment + decor */}
          <div className="flex items-center gap-6 px-10 py-5 flex-1 relative overflow-hidden">
            {/* Decoration items */}
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-10">
              <Landmark className="h-24 w-24 text-white" />
            </div>

            {/* Content */}
            <div className="min-w-0 pr-4 relative z-10">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/40 mb-1.5">Next up</p>
              <p className="text-xl font-bold text-white leading-tight truncate">{nextAppt.specificService}</p>
              <p className="text-sm text-white/60 mt-2 font-medium">
                {nextAppt.bankName} · {format(nextAppt.date.toDate(), "MMM d")}
              </p>
            </div>

            <div className="flex-shrink-0 ml-auto flex flex-col gap-2 relative z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRegisterPasskey();
                }}
                className="px-6 py-2 rounded-xl bg-white/10 text-white font-bold text-xs border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2">
                <Fingerprint className="h-4 w-4" />
                Setup Passkey
              </button>
              <span className="px-6 py-3 rounded-2xl text-sm font-bold bg-white text-[#312e81] hover:bg-slate-50 transition-all active:scale-95 shadow-xl whitespace-nowrap text-center">
                Details →
              </span>
            </div>
          </div>
        </div>
      </button>
    </div >
  );
}


// ── Empty State Widget (Identical to CountdownWidget Styling) ───────────────
function EmptyStateWidget({ upcomingCount, completedCount, onRegisterPasskey }: {
  upcomingCount: number;
  completedCount: number;
  onRegisterPasskey: () => void;
}) {
  return (
    <div className="px-4 md:px-8 mb-7">
      <div className="banner-btn w-full text-left rounded-3xl overflow-hidden relative"
        style={{
          background: `linear-gradient(135deg, ${INDIGO} 0%, #6d28d9 50%, #4338ca 100%)`,
          boxShadow: `0 8px 32px ${INDIGO}40, 0 2px 8px rgba(0,0,0,0.18)`,
        }}
      >
        <div className="pointer-events-none absolute top-0 bottom-0 w-1/3"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", zIndex: 1 }} />

        {/* ── 3-column balanced layout ── */}
        <div className="relative z-10 flex items-stretch divide-x divide-white/10">

          {/* LEFT: Stats */}
          <div className="flex flex-col justify-center items-center gap-3 px-10 py-5 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/40">Overview</p>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black tabular-nums text-white tracking-tighter leading-none">{upcomingCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mt-1">Upcoming</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black tabular-nums text-white/30 tracking-tighter leading-none">{completedCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">Completed</span>
              </div>
            </div>
          </div>

          {/* CENTER: Ambient Message */}
          <div className="flex flex-col justify-center items-center px-10 py-5 flex-1 text-center"
            style={{ background: "rgba(0,0,0,0.15)" }}>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/40 mb-4">Status Update</p>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-black text-white tracking-tight">Schedule Clear</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Everything is in order</p>
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-6 px-10 py-5 flex-1 relative overflow-hidden">
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-10">
              <Landmark className="h-24 w-24 text-white" />
            </div>

            <div className="min-w-0 pr-4 relative z-10">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/40 mb-1.5">Action Center</p>
              <p className="text-xl font-bold text-white leading-tight truncate">Ready for next?</p>
              <p className="text-sm text-white/60 mt-2 font-medium">Quick link to scheduler</p>
            </div>

            <div className="flex-shrink-0 ml-auto flex flex-col gap-2 relative z-10">
              <button
                onClick={onRegisterPasskey}
                className="px-6 py-2.5 rounded-2xl bg-white text-[#312e81] font-bold text-sm shadow-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2">
                <Fingerprint className="h-4 w-4" />
                Setup Passkey
              </button>
              <Link href="/dashboard/bank/appointment-scheduling"
                className="px-6 py-2.5 rounded-2xl bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-sm transition-all hover:bg-white/30 active:scale-95 whitespace-nowrap text-center">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}


// ── Activity Timeline ────────────────────────────────────────────────────────
function ActivityTimeline({ items }: { items: AppointmentData[] }) {
  const events = useMemo(() => items.slice(0, 6).map(apt => ({
    ...apt,
    label: apt.deleted ? "Cancelled" : isBefore(startOfDay(apt.date.toDate()), startOfDay(new Date()))
      ? "Completed" : "Upcoming",
    status: apt.deleted ? "cancelled" : isBefore(startOfDay(apt.date.toDate()), startOfDay(new Date())) ? "completed" : "upcoming",
    color: apt.deleted ? "#f87171" : isBefore(startOfDay(apt.date.toDate()), startOfDay(new Date())) ? "#10b981" : INDIGO,
    icon: apt.deleted ? "✕" : isBefore(startOfDay(apt.date.toDate()), startOfDay(new Date())) ? "✓" : "◎",
  })), [items]);

  if (events.length === 0) return (
    <p className="text-sm text-slate-400 text-center py-4">No activity yet.</p>
  );

  return (
    <div className="relative pt-2 pl-3">
      {/* Dynamic Connector line with gradient */}
      <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-slate-100 via-indigo-100 to-slate-100 opacity-80" />

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {events.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              className="relative flex gap-5 group"
            >
              {/* Timeline Indicator */}
              <div className="relative flex-shrink-0 z-10">
                <div
                  className="w-4.5 h-4.5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-sm ring-4 ring-white"
                  style={{
                    background: ev.color,
                    boxShadow: ev.status === "upcoming" ? `0 0 12px ${ev.color}40` : "none",
                    width: "18px",
                    height: "18px"
                  }}
                >
                  {ev.icon}
                </div>
                {ev.status === "upcoming" && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: ev.color }}
                  />
                )}
              </div>

              {/* Content Card-like structure */}
              < div className="flex-1 min-w-0 pb-1" >
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-bold text-slate-700 leading-tight group-hover:text-indigo-600 transition-colors">{ev.specificService}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-medium text-slate-400">{format(ev.date.toDate(), "MMM d")} · {ev.bankName}</p>
                  <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                    style={{ background: `${ev.color}10`, color: ev.color, border: `1px solid ${ev.color}20` }}>
                    {ev.label}
                  </span>
                </div>
              </div>
            </motion.div >
          ))
          }
        </AnimatePresence >
      </div >
    </div >
  );
}

export default function BankDashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: bankUserData, isLoading: isBankUserLoading } = useDoc(userDocRef);

  async function handleRegisterPasskey() {
    if (!user) return;
    try {
      if (!isPasskeySupported()) {
        throw new Error("Passkeys are not supported on this browser.");
      }

      const credential = await registerPasskey(user.uid, user.email || user.uid, user.displayName || "Stride Bank Employee");
      console.log("Registered Passkey:", credential);

      toast({
        title: "Passkey Registered",
        description: "Secure login successful. You can now use biometrics.",
      });
    } catch (error: any) {
      if (error.name !== 'NotAllowedError') {
        toast({
          variant: "destructive",
          title: "Setup Failed",
          description: error.message || "Failed to register Passkey.",
        });
      }
    }
  }

  const [allAppointments, setAllAppointments] = useState<AppointmentData[]>([]);
  const [timelineOpen, setTimelineOpen] = useState(true);
  const [jumpTarget, setJumpTarget] = useState<Date | null>(null);
  const [modalAppt, setModalAppt] = useState<AppointmentData | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (isBankUserLoading || !bankUserData) return;

      const { bankName, branch } = bankUserData;

      if (!bankName || !branch) {
        setAllAppointments([]);
        return;
      }

      try {
        const appointmentsRef = collection(firestore, "appointments");
        const q = query(
          appointmentsRef,
          where('bankName', '==', bankName),
          where('branch', '==', branch)
        );
        const snap = await getDocs(q);

        const items: AppointmentData[] = [];

        for (const d of snap.docs) {
          const data = d.data();
          if (data.date && data.date.toDate) {
            let customerName = 'Unknown Customer';
            if (data.userId) {
              const customerDocRef = doc(firestore, 'users', data.userId);
              const customerDoc = await getDoc(customerDocRef);
              if (customerDoc.exists()) {
                customerName = customerDoc.data().displayName;
              }
            }

            items.push({
              id: d.id,
              ...data,
              bankName: customerName,
              customerName: customerName
            } as AppointmentData);
          }
        }

        items.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());
        setAllAppointments(items);
      } catch { } // hide errors for simplicity
    };
    fetch();
  }, [user, bankUserData, isBankUserLoading, firestore]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const upcoming = useMemo(() => allAppointments.filter(a => !a.deleted && isAppointmentUpcoming(a.date.toDate(), a.time)), [allAppointments]);
  const past = useMemo(() => allAppointments.filter(a => a.deleted || !isAppointmentUpcoming(a.date.toDate(), a.time)), [allAppointments]);
  const nextAppt = upcoming[0] ?? null;
  const now = useMemo(() => new Date().getTime(), []);

  // All events sorted by nearness to current time
  const allEvents = useMemo(() =>
    [...allAppointments].sort((a, b) =>
      Math.abs(a.date.toDate().getTime() - now) - Math.abs(b.date.toDate().getTime() - now)
    )
    , [allAppointments, now]);

  return (
    <div className="w-full min-h-screen pb-12 relative overflow-hidden">
      {/* ── Ambient Background Layer ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingDoodles />
      </div>
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <style>{`
          .ambient-glow {filter: blur(140px); border-radius: 9999px; position: fixed; }
        `}</style>
        <div className="ambient-glow w-[50vw] h-[50vh] bg-indigo-500/10 top-[-10%] left-[-10%]" />
        <div className="ambient-glow w-[40vw] h-[40vh] bg-purple-500/10 bottom-[10%] right-[-5%]" />
        <div className="ambient-glow w-[30vw] h-[30vh] bg-blue-400/5 top-[40%] right-[30%]" />
      </div>

      {/* Greeting and Top Stats (Ensuring they are above background) */}
      <div className="relative z-10">
        <Greeting />

        {/* ── Unified stats + countdown banner ── */}
        {nextAppt ? (
          <CountdownWidget
            nextAppt={nextAppt}
            upcomingCount={upcoming.length}
            completedCount={past.filter(a => !a.deleted).length}
            onOpen={() => { setJumpTarget(nextAppt.date.toDate()); setModalAppt(nextAppt); }}
            onRegisterPasskey={handleRegisterPasskey}
          />
        ) : (
          /* Option 2: Ambient Focus Empty State (Standardized) */
          <EmptyStateWidget
            upcomingCount={upcoming.length}
            completedCount={past.filter(a => !a.deleted).length}
            onRegisterPasskey={handleRegisterPasskey}
          />
        )}
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="px-4 md:px-8 flex flex-col xl:flex-row gap-8 items-start relative z-10">

        {/* Left — Calendar + Appointments */}
        <div className="w-full xl:flex-1 min-w-0">
          <BankUpcomingAppointments calendarJumpDate={jumpTarget} />
        </div>

        {/* Right — Sidebar */}
        <div className="w-full xl:w-80 flex-shrink-0 flex flex-col gap-5">

          {/* Quick actions */}
          <div className="rounded-2xl bg-white p-5 shadow-sm relative z-10" style={{ border: "1px solid #e2e8f0" }}>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Quick Actions</p>
            <div className="flex flex-col gap-3">
              <QuickActionCard filled href="/dashboard/bank/appointment-scheduling"
                icon={<CalendarCheck className="h-5 w-5" />} label="Schedule Ops" sub="Manage appointments" />
              <QuickActionCard href="/dashboard/bank/document-checklist"
                icon={<FileText className="h-5 w-5" />} label="Document Checklist" sub="Verify required documents" />
            </div>
          </div>

          {/* ── Activity Timeline ── */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
            <button
              className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50"
              onClick={() => setTimelineOpen(v => !v)}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl p-2" style={{ background: `${INDIGO}10` }}>
                  <Clock className="h-4 w-4" style={{ color: INDIGO }} />
                </div>
                <div className="text-left">
                  <p className="text-base font-bold text-slate-700">Activity Timeline</p>
                  <p className="text-xs text-slate-400">{allEvents.length} events</p>
                </div>
              </div>
              {timelineOpen
                ? <ChevronUp className="h-4 w-4 text-slate-400" />
                : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            {timelineOpen && (
              <div className="px-5 pb-5 pt-2">
                <ActivityTimeline items={allEvents} />
              </div>
            )}
          </div>

        </div >
      </div >

      {/* Modal for next appointment */}
      {
        modalAppt && (
          <AppointmentDetailsModal
            appointmentId={modalAppt.id}
            isOpen={!!modalAppt}
            onClose={() => setModalAppt(null)}
          />
        )
      }
    </div >
  );
}

// Stride: Professional Financial Connectivity
