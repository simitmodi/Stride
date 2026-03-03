
"use client";

import { useState, useEffect, useMemo } from "react";
import Greeting from "@/components/greeting";
import UpcomingAppointments from "@/components/upcoming-appointments";
import Link from "next/link";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { doc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
import { format, isBefore, startOfDay, isAfter, differenceInSeconds } from "date-fns";
import { CalendarCheck, FileText, ArrowRight, Clock, CheckCircle2, ChevronDown, ChevronUp, XCircle, Landmark } from "lucide-react";
import { CustomerAppointmentDetailsModal } from "@/components/customer-appointment-details-modal";
import ThreeBackground from "@/components/ThreeBackground";

const INDIGO = "#4F46E5";

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
        <p className="font-bold text-base truncate" style={{ color: filled ? "#fff" : "#1e293b" }}>{label}</p>
        <p className="text-sm mt-0.5 truncate" style={{ color: filled ? "rgba(255,255,255,0.75)" : "#94a3b8" }}>{sub}</p>
      </div>
      <ArrowRight className="ml-auto h-5 w-5 flex-shrink-0 opacity-60 group-hover:translate-x-1 transition-transform" style={{ color: filled ? "#fff" : INDIGO }} />
    </Link>
  );
}

// ── Flip Clock digit ─────────────────────────────────────────────────────────
function FlipDigit({ value, label }: { value: string; label: string }) {
  const [display, setDisplay] = useState({ cur: value, prev: value, flipping: false });

  useEffect(() => {
    if (value === display.cur) return;
    setDisplay(d => ({ cur: d.cur, prev: d.cur, flipping: true }));
    const t1 = setTimeout(() => {
      setDisplay(d => ({ cur: value, prev: d.prev, flipping: true }));
    }, 40); // slightly faster start
    const t2 = setTimeout(() => {
      setDisplay(d => ({ cur: value, prev: value, flipping: false }));
    }, 400); // end after animation

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-[3.2rem] h-[4rem] perspective-[400px]">
        {/* Top Half (New Value - Static) */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/15 rounded-t-lg overflow-hidden flex items-end justify-center pb-[0.5px] border-b border-black/20">
          <span className="text-3xl font-black tabular-nums text-white leading-none transform translate-y-1/2">
            {display.cur}
          </span>
        </div>

        {/* Bottom Half (Old Value - Static) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/10 rounded-b-lg overflow-hidden flex items-start justify-center pt-[0.5px]">
          <span className="text-3xl font-black tabular-nums text-white leading-none transform -translate-y-1/2">
            {display.prev}
          </span>
        </div>

        {/* Flipping Flap (Top -> Bottom) */}
        {display.flipping && (
          <>
            {/* Top flap (Old value, rotating down) */}
            <div
              className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-lg overflow-hidden flex items-end justify-center pb-[0.5px] border-b border-black/20 origin-bottom"
              style={{ animation: 'flipTop 0.4s ease-in forwards', zIndex: 2 }}
            >
              <span className="text-3xl font-black tabular-nums text-white leading-none transform translate-y-1/2">
                {display.prev}
              </span>
            </div>

            {/* Bottom flap (New value, rotating into view) */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/15 rounded-b-lg overflow-hidden flex items-start justify-center pt-[0.5px] origin-top"
              style={{ animation: 'flipBottom 0.4s ease-out forwards', zIndex: 3, transform: 'rotateX(90deg)' }}
            >
              <span className="text-3xl font-black tabular-nums text-white leading-none transform -translate-y-1/2">
                {display.cur}
              </span>
            </div>
          </>
        )}
      </div>
      <span className="text-[8px] text-white/40 font-bold uppercase tracking-[0.15em]">{label}</span>
    </div>
  );
}


// ── Countdown + Stats widget (balanced 3-column) ──────────────────────────────
function CountdownWidget({ nextAppt, upcomingCount, completedCount, onOpen }: {
  nextAppt: AppointmentData;
  upcomingCount: number;
  completedCount: number;
  onOpen: () => void;
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
        className="banner-btn w-full text-left rounded-2xl overflow-hidden relative"
        style={{
          background: `linear-gradient(135deg, ${INDIGO} 0%, #6d28d9 50%, #4338ca 100%)`,
          boxShadow: `0 8px 32px ${INDIGO}50, 0 2px 8px rgba(0,0,0,0.18)`,
        }}
      >
        <style>{`
          @keyframes flipTop      { 0%{transform:rotateX(0deg)} 100%{transform:rotateX(-90deg)} }
          @keyframes flipBottom   { 0%{transform:rotateX(90deg)} 100%{transform:rotateX(0deg)} }
          @keyframes coin3D       { 0%{transform:rotateY(0deg)} 100%{transform:rotateY(360deg)} }
          @keyframes calFloat     { 0%,100%{transform:translateY(0px) rotateX(8deg) rotateY(-12deg)} 50%{transform:translateY(-6px) rotateX(8deg) rotateY(-12deg)} }
          @keyframes floatRandom  { 
            0%   { transform: translate(0, 0) scale(1) rotate(0deg); }
            33%  { transform: translate(120px, 40px) scale(1.1) rotate(10deg); }
            66%  { transform: translate(-40px, 60px) scale(0.9) rotate(-5deg); }
            100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          }
          @keyframes pulseScale   { 0%,100%{transform:scale(1);opacity:0.15} 50%{transform:scale(1.2);opacity:0.25} }
          @keyframes driftSlow    { 0%{transform:translate(0,0)} 50%{transform:translate(40px, -20px)} 100%{transform:translate(0,0)} }
          .coin-3d   { animation: coin3D   4s linear infinite; transform-style: preserve-3d; }
          .cal-float { animation: calFloat 3s ease-in-out infinite; transform-style: preserve-3d; }
          .floating-bg-object  { animation: floatRandom 15s ease-in-out infinite; filter: blur(40px); opacity: 0.15; }
          .floating-bg-object2 { animation: driftSlow 12s ease-in-out infinite; filter: blur(35px); opacity: 0.12; background: #9333ea; }
        `}</style>

        {/* Floating background objects */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-white/40 rounded-full floating-bg-object pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full floating-bg-object2 pointer-events-none" />

        {/* Shimmer */}
        <div className="pointer-events-none absolute top-0 bottom-0 w-1/3"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", zIndex: 1 }} />

        {/* ── 3-column balanced layout ── */}
        <div className="relative z-10 flex items-stretch divide-x divide-white/15">

          {/* LEFT: Stats */}
          <div className="flex flex-col justify-center items-center gap-3 px-7 py-2.5 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/45">Overview</p>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black tabular-nums text-white leading-none">{upcomingCount}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/50 mt-1">Upcoming</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black tabular-nums text-white/45 leading-none">{completedCount}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/30 mt-1">Completed</span>
              </div>
            </div>
          </div>

          {/* CENTER: Flip Clock */}
          <div className="flex flex-col justify-center items-center px-7 py-2.5 flex-1"
            style={{ background: "rgba(0,0,0,0.10)" }}>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/45 mb-4">Next appointment in</p>
            <div className="flex items-center gap-2">
              <FlipDigit value={pad(days)} label="days" />
              <span className="text-white/20 font-black text-3xl mb-7">:</span>
              <FlipDigit value={pad(hrs)} label="hrs" />
              <span className="text-white/20 font-black text-3xl mb-7">:</span>
              <FlipDigit value={pad(mins)} label="min" />
              <span className="text-white/20 font-black text-3xl mb-7">:</span>
              <FlipDigit value={pad(sec)} label="sec" />
            </div>
          </div>

          {/* RIGHT: Appointment + decor */}
          <div className="flex items-center gap-5 px-7 py-2.5 flex-1 relative overflow-hidden">
            {/* 3D floating calendar */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 cal-float"
              style={{ transformStyle: "preserve-3d" }}>
              <svg width="60" height="60" viewBox="0 0 52 52" fill="none">
                <rect x="2" y="8" width="48" height="42" rx="6" fill="white" />
                <rect x="2" y="8" width="48" height="16" rx="6" fill="white" fillOpacity="0.6" />
                <rect x="16" y="2" width="4" height="10" rx="2" fill="white" />
                <rect x="32" y="2" width="4" height="10" rx="2" fill="white" />
                {[0, 1, 2, 3, 4].map(r => [0, 1, 2, 3, 4, 5, 6].map(c => (
                  <rect key={`${r}-${c}`} x={8 + c * 6} y={29 + r * 6} width="3" height="3" rx="0.5" fill="white" fillOpacity="0.5" />
                )))}
              </svg>
            </div>
            {/* 3D spinning coin */}
            <div className="absolute right-16 bottom-2 pointer-events-none" style={{ perspective: "200px" }}>
              <div className="coin-3d">
                <svg width="28" height="28" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="12" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
                  <text x="13" y="17" textAnchor="middle" fontSize="11" fill="white" fillOpacity="0.7">₹</text>
                </svg>
              </div>
            </div>
            {/* Text */}
            <div className="min-w-0 pr-4">
              <p className="text-sm font-extrabold uppercase tracking-widest text-white/45 mb-1.5">Next up</p>
              <p className="text-xl font-bold text-white leading-tight">{nextAppt.specificService}</p>
              <p className="text-sm text-white/55 mt-1.5">
                {nextAppt.bankName} · {format(nextAppt.date.toDate(), "MMM d")}
              </p>
            </div>
            <span className="flex-shrink-0 ml-auto px-6 py-2.5 rounded-xl text-base font-bold bg-white/15 text-white border border-white/20 hover:bg-white/25 transition-all active:scale-95 whitespace-nowrap">
              Details →
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}


// ── Activity Timeline ────────────────────────────────────────────────────────
function ActivityTimeline({ items }: { items: AppointmentData[] }) {
  const events = useMemo(() => items.slice(0, 6).map(apt => ({
    ...apt,
    label: apt.deleted ? "Cancelled" : isBefore(startOfDay(apt.date.toDate()), startOfDay(new Date()))
      ? "Completed" : "Upcoming",
    color: apt.deleted ? "#f87171" : isBefore(startOfDay(apt.date.toDate()), startOfDay(new Date())) ? "#10b981" : INDIGO,
    icon: apt.deleted ? "✕" : isBefore(startOfDay(apt.date.toDate()), startOfDay(new Date())) ? "✓" : "◎",
  })), [items]);

  if (events.length === 0) return (
    <p className="text-sm text-slate-400 text-center py-4">No activity yet.</p>
  );

  return (
    <div className="relative pl-5">
      {/* vertical line */}
      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-slate-100" />
      {events.map((ev, i) => (
        <div key={ev.id} className="relative flex gap-3 mb-5 last:mb-0">
          {/* dot */}
          <div
            className="absolute -left-5 mt-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white flex-shrink-0"
            style={{ background: ev.color, boxShadow: `0 0 0 3px ${ev.color}20` }}
          >
            {ev.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-slate-700 truncate">{ev.specificService}</p>
              <span className="text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                style={{ background: `${ev.color}15`, color: ev.color }}>
                {ev.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{format(ev.date.toDate(), "MMM d, yyyy")} · {ev.bankName}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CustomerDashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const userDocRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const [allAppointments, setAllAppointments] = useState<AppointmentData[]>([]);
  const [timelineOpen, setTimelineOpen] = useState(true);
  const [jumpTarget, setJumpTarget] = useState<Date | null>(null);
  const [modalAppt, setModalAppt] = useState<AppointmentData | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (isUserDocLoading || !user) return;
      const ids = userData?.appointmentIds;
      if (!ids || ids.length === 0) return;
      try {
        const q = query(collection(firestore, "appointments"), where("__name__", "in", ids));
        const snap = await getDocs(q);
        const items: AppointmentData[] = [];
        snap.forEach(d => { const data = d.data(); if (data.date?.toDate) items.push({ id: d.id, ...data } as AppointmentData); });
        items.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());
        setAllAppointments(items);
      } catch { }
    };
    fetch();
  }, [user, userData, isUserDocLoading, firestore]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const upcoming = useMemo(() => allAppointments.filter(a => !a.deleted && !isAfter(today, startOfDay(a.date.toDate()))), [allAppointments, today]);
  const past = useMemo(() => allAppointments.filter(a => isBefore(startOfDay(a.date.toDate()), today) || a.deleted), [allAppointments, today]);
  const nextAppt = upcoming[0] ?? null;

  // All events sorted newest-first for timeline
  const allEvents = useMemo(() => [...allAppointments].sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime()), [allAppointments]);

  return (
    <div className="w-full min-h-screen pb-12 relative overflow-hidden">
      {/* ── Ambient Background Layer ── */}
      <div className="fixed inset-0 pointer-events-none z-[-2] opacity-40">
        <ThreeBackground />
      </div>
      <div className="absolute inset-0 pointer-events-none z-[-1] opacity-40">
        <style>{`
          @keyframes ambientDrift1 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(10vw, 5vh) scale(1.1)} 100%{transform:translate(0,0) scale(1)} }
          @keyframes ambientDrift2 { 0%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(-8vw, 10vh) rotate(15deg)} 100%{transform:translate(0,0) rotate(0deg)} }
          @keyframes ambientPulse  { 0%,100%{opacity:0.3} 50%{opacity:0.6} }
          .ambient-glow { filter: blur(140px); border-radius: 9999px; position: fixed; }
        `}</style>
        <div className="ambient-glow w-[50vw] h-[50vh] bg-indigo-500/10 top-[-10%] left-[-10%]" style={{ animation: 'ambientDrift1 25s ease-in-out infinite' }} />
        <div className="ambient-glow w-[40vw] h-[40vh] bg-purple-500/10 bottom-[10%] right-[-5%]" style={{ animation: 'ambientDrift2 30s ease-in-out infinite' }} />
        <div className="ambient-glow w-[30vw] h-[30vh] bg-blue-400/5 top-[40%] right-[30%]" style={{ animation: 'ambientPulse 15s ease-in-out infinite' }} />
      </div>

      {/* Greeting */}
      <Greeting />

      {/* ── Unified stats + countdown banner ── */}
      {nextAppt ? (
        <CountdownWidget
          nextAppt={nextAppt}
          upcomingCount={upcoming.length}
          completedCount={past.filter(a => !a.deleted).length}
          onOpen={() => { setJumpTarget(nextAppt.date.toDate()); setModalAppt(nextAppt); }}
        />
      ) : (
        /* No upcoming — show plain stat strip */
        <div className="px-4 md:px-8 mb-8">
          <div className="w-full rounded-3xl px-8 py-6 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-0"
            style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", boxShadow: `0 8px 32px ${INDIGO}12` }}>
            <div className="flex flex-col items-center sm:items-start sm:pr-8 sm:border-r sm:border-slate-100">
              <span className="text-[56px] leading-none font-black tabular-nums" style={{ color: INDIGO }}>{upcoming.length}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400 mt-1">Upcoming</span>
            </div>
            <div className="flex flex-col items-center sm:items-start sm:pl-8">
              <span className="text-[56px] leading-none font-black tabular-nums text-slate-300">{past.filter(a => !a.deleted).length}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-300 mt-1">Completed</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Main 2-column layout ── */}
      <div className="px-4 md:px-8 flex flex-col xl:flex-row gap-8 items-start relative z-10">

        {/* Left — Calendar + Appointments */}
        <div className="w-full xl:flex-1 min-w-0">
          <UpcomingAppointments calendarJumpDate={jumpTarget} />
        </div>

        {/* Right — Sidebar */}
        <div className="w-full xl:w-80 flex-shrink-0 flex flex-col gap-5">

          {/* Quick actions */}
          <div className="rounded-2xl bg-white p-5 shadow-sm relative z-10" style={{ border: "1px solid #e2e8f0" }}>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Quick Actions</p>
            <div className="flex flex-col gap-3">
              <QuickActionCard filled href="/dashboard/customer/appointment-scheduling"
                icon={<CalendarCheck className="h-5 w-5" />} label="Book Appointment" sub="Schedule a new visit" />
              <QuickActionCard href="/dashboard/customer/document-checklist"
                icon={<FileText className="h-5 w-5" />} label="Document Checklist" sub="Review required documents" />
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

          {/* Tips card */}
          <div className="rounded-2xl p-5 text-white relative z-10" style={{ background: `linear-gradient(135deg, ${INDIGO}, #7c3aed)` }}>
            <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2">Tip of the day</p>
            <p className="font-bold text-sm leading-relaxed">Prepare your documents 48 hours before your appointment for a smoother experience.</p>
            <Link href="/dashboard/customer/document-checklist" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold opacity-80 hover:opacity-100 transition-opacity">
              View checklist <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modal for next appointment */}
      {modalAppt && (
        <CustomerAppointmentDetailsModal
          appointment={modalAppt}
          isOpen={!!modalAppt}
          onClose={() => setModalAppt(null)}
          onAppointmentUpdate={(updated) => setAllAppointments(prev => prev.map(a => a.id === updated.id ? updated : a))}
          onAppointmentCancel={(id) => setAllAppointments(prev => prev.filter(a => a.id !== id))}
        />
      )}
    </div>
  );
}
