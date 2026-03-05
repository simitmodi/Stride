"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { startOfDay, isAfter, isSameDay } from "date-fns";
import { motion } from "framer-motion";

const INDIGO = "#4F46E5";
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

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

type PanelRole = "prev" | "center" | "next";

interface MiniCalendarProps {
    year: number;
    month: number;
    role: PanelRole;
    today: Date;
    appointments: AppointmentData[];
    selectedDate: Date;
    onSelectDate: (d: Date) => void;
}

function MiniCalendar({ year, month, role, today, appointments, selectedDate, onSelectDate }: MiniCalendarProps) {
    const isCenter = role === "center";
    const isPrev = role === "prev";
    const isNext = role === "next";

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);
    const todayStart = startOfDay(today);

    const { pastDays, futureDays, cancelledDays } = useMemo(() => {
        const past = new Set<number>(), future = new Set<number>(), cancelled = new Set<number>();
        appointments.forEach((apt) => {
            const d = apt.date.toDate();
            if (d.getFullYear() !== year || d.getMonth() !== month) return;
            if (apt.deleted) { cancelled.add(d.getDate()); return; }
            (isAfter(todayStart, startOfDay(d)) ? past : future).add(d.getDate());
        });
        return { pastDays: past, futureDays: future, cancelledDays: cancelled };
    }, [appointments, year, month, todayStart]);

    const isToday = (day: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    const isSelected = (day: number) => isCenter && selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day;

    const cells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    return (
        <div className={cn("flex flex-col transition-all duration-300", !isCenter && "opacity-50")}>
            {/* Month name (Hide for center as it's in the header) */}
            {!isCenter && (
                <p className="text-center font-bold mb-2 text-[10px]" style={{ color: "#94a3b8" }}>
                    {MONTH_NAMES[month].slice(0, 3)}
                </p>
            )}

            {/* Day labels */}
            <div className="grid grid-cols-7">
                {DAY_LABELS.map((d) => (
                    <span key={d} className="text-center block"
                        style={{ fontSize: isCenter ? "13px" : "9px", color: "#94a3b8", padding: "3px 0" }}>
                        {isCenter ? d : d[0]}
                    </span>
                ))}
            </div>

            {/* Cell animation keyframes (only for center) */}
            {isCenter && (
                <style>{`
                    @keyframes calCell { 0%{opacity:0;transform:scale(0.7)} 70%{transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
                    @keyframes selPulse { 0%,100%{box-shadow:0 0 0 0px ${INDIGO}30} 50%{box-shadow:0 0 0 6px ${INDIGO}00} }
                    .cal-cell { animation: calCell 0.28s cubic-bezier(.34,1.56,.64,1) both; }
                    .cal-sel  { animation: selPulse 2s ease-in-out infinite; }
                `}</style>
            )}

            {/* Cells — keyed on month+year so they re-animate on navigation */}
            <div key={`${year}-${month}`} className="grid grid-cols-7 gap-y-1">
                {cells.map((day, idx) => {
                    if (!day) return <div key={idx} />;
                    const todayDay = isToday(day);
                    const selectedDay = isSelected(day);
                    const hasPast = pastDays.has(day);
                    const hasFuture = futureDays.has(day);

                    if (isCenter) {
                        const hasCancelled = cancelledDays.has(day);
                        return (
                            <button
                                key={idx}
                                onClick={() => onSelectDate(startOfDay(new Date(year, month, day)))}
                                className={cn(
                                    "cal-cell relative flex flex-col items-center justify-center mx-auto w-full aspect-square max-w-[3rem] rounded-xl transition-colors duration-150 hover:scale-105",
                                    selectedDay && !todayDay && "cal-sel"
                                )}
                                style={{
                                    background: todayDay ? INDIGO : selectedDay ? `${INDIGO}18` : "transparent",
                                    color: todayDay ? "#fff" : selectedDay ? INDIGO : "#1e293b",
                                    fontWeight: todayDay || selectedDay ? 700 : 400,
                                    fontSize: "15px",
                                    outline: selectedDay && !todayDay ? `2px solid ${INDIGO}` : "none",
                                    animationDelay: `${idx * 12}ms`,
                                    transition: "background 0.15s, color 0.15s, transform 0.15s",
                                }}
                            >
                                {day}
                                {/* Future confirmed — green dot */}
                                {hasFuture && !todayDay && (
                                    <span className="absolute rounded-full" style={{ bottom: "4px", left: "50%", transform: "translateX(-50%)", width: "5px", height: "5px", background: "#10b981" }} />
                                )}
                                {/* Past completed — indigo underline */}
                                {hasPast && !todayDay && (
                                    <span className="absolute rounded" style={{ bottom: "4px", left: "50%", transform: "translateX(-50%)", width: "16px", height: "2px", background: `${INDIGO}60` }} />
                                )}
                                {/* Cancelled — red dot */}
                                {hasCancelled && !todayDay && (
                                    <span className="absolute rounded-full" style={{ bottom: hasFuture || hasPast ? "9px" : "4px", left: "50%", transform: "translateX(-50%)", width: "4px", height: "4px", background: "#f87171" }} />
                                )}
                            </button>
                        );
                    }

                    // Side panels
                    const nextHasAppt = isNext && hasFuture;
                    const prevHasAppt = isPrev && hasPast;
                    const hasAppt = nextHasAppt || prevHasAppt;

                    return (
                        <div key={idx} className="relative flex items-center justify-center mx-auto w-full aspect-square max-w-[1.5rem] rounded-md"
                            style={{
                                fontSize: "10px",
                                fontWeight: todayDay || hasAppt ? 700 : 400,
                                background: todayDay ? INDIGO : hasAppt ? `${INDIGO}25` : "transparent",
                                color: todayDay ? "#fff" : hasAppt ? INDIGO : "#94a3b8",
                                outline: (hasAppt && !todayDay) ? `1px solid ${INDIGO}40` : "none",
                            }}>
                            {day}
                            {hasAppt && !todayDay && (
                                <motion.div
                                    className="absolute inset-0 rounded-md pointer-events-none"
                                    animate={{
                                        boxShadow: [`0 0 0px ${INDIGO}00`, `0 0 8px ${INDIGO}30`, `0 0 0px ${INDIGO}00`]
                                    }}
                                    transition={{ repeat: Infinity, duration: 3, delay: (day % 5) * 0.2 }}
                                />
                            )}
                            {prevHasAppt && !todayDay && (
                                <span className="absolute rounded" style={{ bottom: "2px", left: "50%", transform: "translateX(-50%)", width: "10px", height: "1.5px", background: `${INDIGO}80` }} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Main component (Controlled) ─────────────────────────────────────────────
interface ThreeMonthCalendarProps {
    appointments: AppointmentData[];
    selectedDate: Date;
    centerMonth: number;
    centerYear: number;
    onCenterChange: (month: number, year: number) => void;
    onSelectDate: (d: Date) => void;
    onAppointmentClick: (apt: AppointmentData) => void;
    standalone?: boolean;
}

export default function ThreeMonthCalendar({
    appointments, selectedDate, centerMonth, centerYear,
    onCenterChange, onSelectDate, onAppointmentClick,
    standalone = true
}: ThreeMonthCalendarProps) {
    const today = useMemo(() => new Date(), []);
    const getRelativeMonth = (offset: number) => {
        let m = centerMonth + offset, y = centerYear;
        if (m < 0) { m += 12; y -= 1; }
        if (m > 11) { m -= 12; y += 1; }
        return { month: m, year: y };
    };
    const prev = getRelativeMonth(-1);
    const next = getRelativeMonth(1);

    const nav = (dir: -1 | 1) => {
        let m = centerMonth + dir, y = centerYear;
        if (m < 0) { m = 11; y -= 1; }
        if (m > 11) { m = 0; y += 1; }
        onCenterChange(m, y);
    };

    const isCurrentMonth = centerMonth === today.getMonth() && centerYear === today.getFullYear();

    const calendarContent = (
        <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
                <button onClick={() => nav(-1)} className="p-1.5 rounded-lg transition-colors hover:bg-slate-100" style={{ color: "#64748b" }} aria-label="Previous month">
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold tracking-tight" style={{ color: INDIGO }}>
                        {MONTH_NAMES[centerMonth]} {centerYear}
                    </span>
                    {!isCurrentMonth && (
                        <button onClick={() => { onCenterChange(today.getMonth(), today.getFullYear()); onSelectDate(startOfDay(today)); }}
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ color: INDIGO, background: `${INDIGO}14`, border: `1px solid ${INDIGO}30` }}>
                            Today
                        </button>
                    )}
                </div>

                <button onClick={() => nav(1)} className="p-1.5 rounded-lg transition-colors hover:bg-slate-100" style={{ color: "#64748b" }} aria-label="Next month">
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            {/* 3-month grid: 20 | 60 | 20 */}
            <div className="flex items-start w-full px-2 py-4 gap-0">
                {/* Prev 20% */}
                <button
                    onClick={() => nav(-1)}
                    className="w-[20%] px-1 pt-6 text-left transition-transform hover:scale-[1.02] active:scale-95 group"
                    aria-label="Go to previous month"
                >
                    <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                        <MiniCalendar year={prev.year} month={prev.month} role="prev" today={today}
                            appointments={appointments} selectedDate={selectedDate} onSelectDate={onSelectDate} />
                    </div>
                </button>

                {/* Divider */}
                <div className="self-stretch mx-1" style={{ width: "1px", background: "#f1f5f9", flexShrink: 0 }} />

                {/* Center 60% */}
                <div className="w-[60%] px-2">
                    <MiniCalendar year={centerYear} month={centerMonth} role="center" today={today}
                        appointments={appointments} selectedDate={selectedDate} onSelectDate={onSelectDate} />
                </div>

                {/* Divider */}
                <div className="self-stretch mx-1" style={{ width: "1px", background: "#f1f5f9", flexShrink: 0 }} />

                {/* Next 20% */}
                <button
                    onClick={() => nav(1)}
                    className="w-[20%] px-1 pt-6 text-left transition-transform hover:scale-[1.02] active:scale-95 group"
                    aria-label="Go to next month"
                >
                    <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                        <MiniCalendar year={next.year} month={next.month} role="next" today={today}
                            appointments={appointments} selectedDate={selectedDate} onSelectDate={onSelectDate} />
                    </div>
                </button>
            </div>
        </>
    );

    if (!standalone) return calendarContent;

    return (
        <div className="w-full rounded-2xl border shadow-sm overflow-hidden bg-white" style={{ borderColor: "#e2e8f0" }}>
            {calendarContent}
        </div>
    );
}

// Stride: Professional Financial Connectivity
