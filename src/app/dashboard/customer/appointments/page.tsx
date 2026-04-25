
'use client';

import { useState, useEffect, useMemo } from "react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { doc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
import { format, isBefore, startOfDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { isAppointmentUpcoming } from "@/lib/utils";
import { CustomerAppointmentDetailsModal } from "@/components/customer-appointment-details-modal";
import {
  CalendarCheck, Clock, CheckCircle2, XCircle, Search, List, Table2,
  ChevronRight, Landmark, ArrowUpDown, Filter, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

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
  confirmedDocuments?: string[];
  address?: string;
  deleted?: boolean;
}

type FilterStatus = "all" | "upcoming" | "completed" | "cancelled";
type ViewMode = "timeline" | "table";
type SortField = "date" | "bank" | "service";
type SortDir = "asc" | "desc";

// ── Status helpers ───────────────────────────────────────────────────────────
function getStatus(a: AppointmentData): "upcoming" | "completed" | "cancelled" {
  if (a.deleted) return "cancelled";
  return isAppointmentUpcoming(a.date.toDate(), a.time) ? "upcoming" : "completed";
}

const statusConfig = {
  upcoming:  { label: "Upcoming",  color: INDIGO,    bg: `${INDIGO}12`, icon: CalendarCheck },
  completed: { label: "Completed", color: "#10b981",  bg: "#10b98112",   icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "#f87171",  bg: "#f8717112",   icon: XCircle },
};

// ── Filter Chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, active, count, onClick }: { label: string; active: boolean; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
      style={active
        ? { background: INDIGO, color: "#fff", boxShadow: `0 4px 14px ${INDIGO}40` }
        : { background: "white", color: "#64748b", border: "1px solid #e2e8f0" }
      }
    >
      {label}
      <span className="ml-2 text-xs font-black opacity-60">{count}</span>
    </button>
  );
}

// ── Timeline View ────────────────────────────────────────────────────────────
function TimelineView({ appointments, onSelect }: { appointments: AppointmentData[]; onSelect: (a: AppointmentData) => void }) {
  if (appointments.length === 0) return <EmptyState />;

  return (
    <div className="relative pl-6 space-y-0">
      {/* Vertical connector */}
      <div className="absolute left-[43px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-indigo-200 via-indigo-100 to-slate-100" />

      {appointments.map((apt, i) => {
        const status = getStatus(apt);
        const cfg = statusConfig[status];
        const Icon = cfg.icon;

        return (
          <motion.div
            key={apt.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className="relative flex gap-5 group cursor-pointer py-4"
            onClick={() => onSelect(apt)}
          >
            {/* Timeline dot */}
            <div className="relative flex-shrink-0 z-10">
              <div
                className="w-[38px] h-[38px] rounded-xl flex items-center justify-center shadow-sm border-2 border-white"
                style={{ background: cfg.bg }}
              >
                <Icon className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              {status === "upcoming" && (
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-xl"
                  style={{ background: cfg.color }}
                />
              )}
            </div>

            {/* Card */}
            <div className="flex-1 min-w-0 bg-white rounded-2xl px-5 py-4 border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-indigo-100 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-800 truncate">{apt.specificService}</h3>
                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg flex-shrink-0 ml-3"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}20` }}
                >
                  {cfg.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5" />
                  {apt.bankName}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {format(apt.date.toDate(), "MMM d, yyyy")} at {apt.time}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">{apt.branch}</p>
            </div>

            <div className="flex items-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5 text-indigo-400" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Table View ───────────────────────────────────────────────────────────────
function TableView({ appointments, onSelect, sortField, sortDir, onSort }: {
  appointments: AppointmentData[];
  onSelect: (a: AppointmentData) => void;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
}) {
  if (appointments.length === 0) return <EmptyState />;

  const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      className="px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-wider text-slate-400 cursor-pointer hover:text-indigo-500 transition-colors select-none"
      onClick={() => onSort(field)}
    >
      <span className="flex items-center gap-1.5">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sortField === field ? 'text-indigo-500' : 'opacity-40'}`} />
      </span>
    </th>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <SortableHeader field="service" label="Service" />
              <SortableHeader field="bank" label="Bank" />
              <th className="px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">Branch</th>
              <SortableHeader field="date" label="Date & Time" />
              <th className="px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">Status</th>
              <th className="px-5 py-3.5 text-right text-[11px] font-black uppercase tracking-wider text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {appointments.map((apt, i) => {
              const status = getStatus(apt);
              const cfg = statusConfig[status];

              return (
                <motion.tr
                  key={apt.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-indigo-50/30 transition-colors cursor-pointer"
                  onClick={() => onSelect(apt)}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800 text-sm">{apt.specificService}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{apt.serviceCategory}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{apt.bankName}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{apt.branch}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-700">{format(apt.date.toDate(), "MMM d, yyyy")}</p>
                    <p className="text-xs text-slate-400">{apt.time}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg inline-block"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}20` }}
                    >
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
                      Details →
                    </Button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6" style={{ background: `${INDIGO}10` }}>
        <CalendarCheck className="w-10 h-10" style={{ color: INDIGO }} />
      </div>
      <h3 className="text-xl font-bold text-slate-700 mb-2">No Appointments Found</h3>
      <p className="text-sm text-slate-400 mb-6 text-center max-w-xs">
        No appointments match the current filters. Try broadening your search or book a new one!
      </p>
      <Link href="/dashboard/customer/appointment-scheduling">
        <Button style={{ background: INDIGO }} className="text-white font-bold rounded-xl px-6">
          <CalendarCheck className="w-4 h-4 mr-2" /> Book Appointment
        </Button>
      </Link>
    </div>
  );
}

// ── View Toggle (bottom of page) ────────────────────────────────────────────
function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xl rounded-2xl p-1.5 shadow-2xl border border-slate-200">
        <button
          onClick={() => onChange("timeline")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
          style={view === "timeline"
            ? { background: INDIGO, color: "#fff", boxShadow: `0 4px 14px ${INDIGO}40` }
            : { color: "#64748b" }
          }
        >
          <List className="w-4 h-4" />
          Timeline
        </button>
        <button
          onClick={() => onChange("table")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
          style={view === "table"
            ? { background: INDIGO, color: "#fff", boxShadow: `0 4px 14px ${INDIGO}40` }
            : { color: "#64748b" }
          }
        >
          <Table2 className="w-4 h-4" />
          Table
        </button>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const userDocRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const [allAppointments, setAllAppointments] = useState<AppointmentData[]>([]);
  const [isLoadingAppts, setIsLoadingAppts] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("timeline");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [modalAppt, setModalAppt] = useState<AppointmentData | null>(null);

  // Fetch appointments
  useEffect(() => {
    const fetchApps = async () => {
      if (isUserDocLoading || !user) return;
      const ids = userData?.appointmentIds;
      if (!ids || ids.length === 0) { setIsLoadingAppts(false); return; }
      try {
        const q = query(collection(firestore, "appointments"), where("__name__", "in", ids));
        const snap = await getDocs(q);
        const items: AppointmentData[] = [];
        snap.forEach(d => { const data = d.data(); if (data.date?.toDate) items.push({ id: d.id, ...data } as AppointmentData); });
        items.sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());
        setAllAppointments(items);
      } catch (e) { console.error("Error fetching appointments:", e); }
      setIsLoadingAppts(false);
    };
    fetchApps();
  }, [user, userData, isUserDocLoading, firestore]);

  // Counts
  const counts = useMemo(() => {
    const all = allAppointments.length;
    const upcoming = allAppointments.filter(a => getStatus(a) === "upcoming").length;
    const completed = allAppointments.filter(a => getStatus(a) === "completed").length;
    const cancelled = allAppointments.filter(a => getStatus(a) === "cancelled").length;
    return { all, upcoming, completed, cancelled };
  }, [allAppointments]);

  // Filter + Search + Sort
  const filteredAppointments = useMemo(() => {
    let result = [...allAppointments];

    // Filter by status
    if (filter !== "all") {
      result = result.filter(a => getStatus(a) === filter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.specificService.toLowerCase().includes(q) ||
        a.bankName.toLowerCase().includes(q) ||
        a.branch.toLowerCase().includes(q) ||
        a.serviceCategory.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "date": cmp = a.date.toDate().getTime() - b.date.toDate().getTime(); break;
        case "bank": cmp = a.bankName.localeCompare(b.bankName); break;
        case "service": cmp = a.specificService.localeCompare(b.specificService); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [allAppointments, filter, search, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  if (isLoadingAppts) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: INDIGO }} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-28 relative">
      {/* Header */}
      <div className="px-4 md:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Appointments</h1>
            <p className="text-sm text-slate-400 mt-1">View and manage all your bank appointments</p>
          </div>
          <Link href="/dashboard/customer/appointment-scheduling">
            <Button style={{ background: INDIGO }} className="text-white font-bold rounded-xl px-5 shadow-lg hover:shadow-xl transition-shadow">
              <CalendarCheck className="w-4 h-4 mr-2" /> Book New
            </Button>
          </Link>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by service, bank, or branch..."
              className="pl-10 bg-white border-slate-200 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <FilterChip label="All" active={filter === "all"} count={counts.all} onClick={() => setFilter("all")} />
            <FilterChip label="Upcoming" active={filter === "upcoming"} count={counts.upcoming} onClick={() => setFilter("upcoming")} />
            <FilterChip label="Completed" active={filter === "completed"} count={counts.completed} onClick={() => setFilter("completed")} />
            <FilterChip label="Cancelled" active={filter === "cancelled"} count={counts.cancelled} onClick={() => setFilter("cancelled")} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === "timeline" ? (
              <TimelineView appointments={filteredAppointments} onSelect={setModalAppt} />
            ) : (
              <TableView
                appointments={filteredAppointments}
                onSelect={setModalAppt}
                sortField={sortField}
                sortDir={sortDir}
                onSort={handleSort}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* View Toggle at bottom */}
      <ViewToggle view={view} onChange={setView} />

      {/* Detail Modal */}
      {modalAppt && (
        <CustomerAppointmentDetailsModal
          appointment={modalAppt}
          isOpen={!!modalAppt}
          onClose={() => setModalAppt(null)}
          onAppointmentUpdate={(updated) => {
            setAllAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
            setModalAppt(null);
          }}
          onAppointmentCancel={(id) => {
            setAllAppointments(prev => prev.map(a => a.id === id ? { ...a, deleted: true } : a));
            setModalAppt(null);
          }}
        />
      )}
    </div>
  );
}
