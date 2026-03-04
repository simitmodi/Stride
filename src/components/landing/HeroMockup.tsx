"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
    CheckCircle,
    Clock,
    MapPin,
    Calendar,
    Search,
    ArrowRight,
    LayoutDashboard,
    Users,
    FileText,
    HelpCircle,
    Bell
} from "lucide-react";
import { useEffect, useState } from "react";

export function HeroMockup() {
    // Mouse Parallax Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 40, stiffness: 250 };
    const dx = useSpring(mouseX, springConfig);
    const dy = useSpring(mouseY, springConfig);

    // Parallax Ratios
    const tabletX = useTransform(dx, [-500, 500], [-8, 8]);
    const tabletY = useTransform(dy, [-500, 500], [-8, 8]);
    const cardLX = useTransform(dx, [-500, 500], [-15, 15]);
    const cardLY = useTransform(dy, [-500, 500], [-15, 15]);
    const cardRX = useTransform(dx, [-500, 500], [15, -15]);
    const cardRY = useTransform(dy, [-500, 500], [15, -15]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - window.innerWidth / 2);
            mouseY.set(e.clientY - window.innerHeight / 2);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="relative w-full max-w-6xl mx-auto h-[600px] flex items-center justify-center perspective-[2000px] mb-24 pointer-events-none">

            {/* Background Ambient Glows */}
            <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
            />

            {/* Main Tablet Mockup */}
            <motion.div
                style={{
                    rotateX: 12,
                    rotateY: -2,
                    x: tabletX,
                    y: tabletY
                }}
                whileHover={{
                    rotateX: 14,
                    rotateY: 2,
                    scale: 1.01,
                    transition: { duration: 0.5, ease: "easeOut" }
                }}
                className="relative z-10 w-full max-w-4xl aspect-[16/10] bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] border-[12px] border-[#6366f1]/20 dark:border-indigo-500/10 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3),0_0_50px_rgba(99,102,241,0.1)] flex overflow-hidden pointer-events-auto transition-shadow hover:shadow-[0_80px_150px_-30px_rgba(99,102,241,0.3)]"
            >
                {/* Sidebar */}
                <div className="w-20 md:w-56 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <div className="w-6 h-1 bg-primary rounded-full mb-1" />
                        <div className="w-4 h-1 bg-primary/50 rounded-full" />
                    </div>

                    <div className="flex flex-col gap-4">
                        {[
                            { icon: LayoutDashboard, label: "Dashboard", active: false },
                            { icon: Users, label: "Appointments", active: true },
                            { icon: FileText, label: "Documents", active: false },
                            { icon: HelpCircle, label: "Support", active: false },
                        ].map((item, i) => (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${item.active ? 'bg-primary/10 text-primary' : 'text-slate-400'}`}>
                                <item.icon className="w-5 h-5" />
                                <span className="hidden md:block text-sm font-bold">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="flex-1 bg-white dark:bg-slate-900 p-8 flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <div className="w-full h-10 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-800 flex items-center pl-12 text-sm text-slate-400 font-medium">
                                Search banks & services...
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Book Your Visit</h3>
                                    <p className="text-sm text-slate-500 font-medium tracking-tight">Select Bank, Service & Time Slot</p>
                                </div>
                                <button className="text-xs font-bold text-slate-400 hover:text-primary flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { name: "HDFC Bank", color: "bg-blue-600" },
                                    { name: "SBI", color: "bg-blue-500", active: true },
                                    { icon: "O", name: "ICICI Bank", color: "bg-orange-500" },
                                    { icon: "A", name: "Axis Bank", color: "bg-purple-600" }
                                ].map((bank, i) => (
                                    <div key={i} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${bank.active ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'}`}>
                                        <div className={`w-10 h-10 rounded-lg ${bank.color} flex items-center justify-center text-white font-black text-lg shadow-lg`}>
                                            {bank.name[0]}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{bank.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Slots</p>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {["Today, 10", "Tomorrow, 11", "Fri, 12", "Sat, 13"].map((date, i) => (
                                    <div key={i} className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border-2 transition-all flex flex-col items-center ${i === 1 ? 'border-primary bg-primary/10 text-primary' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500'}`}>
                                        {date}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {["10:30 AM", "11:15 AM", "01:00 PM", "03:30 PM"].map((time, i) => (
                                    <div key={i} className={`h-11 rounded-xl border-2 flex items-center justify-center text-xs font-bold tracking-tight transition-all ${i === 0 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-slate-100 dark:border-slate-800'}`}>
                                        {time}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto flex justify-end">
                        <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 flex items-center gap-2 transition-all hover:scale-105">
                            Confirm Booking <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Light Sweep */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-50"
                    animate={{ x: [-1000, 1000] }}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 5, ease: "linear" }}
                />
            </motion.div>

            {/* Floating Glass Cards */}
            {/* Top Left: Documents Ready */}
            <motion.div
                style={{ x: cardLX, y: cardLY }}
                animate={{
                    y: [-10, 10, -10],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                whileHover={{
                    scale: 1.05,
                    zIndex: 50,
                    transition: { duration: 0.3 }
                }}
                className="absolute -left-12 top-10 z-20 w-64 p-5 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-indigo-400/50 shadow-2xl flex items-center gap-4 pointer-events-auto cursor-pointer"
            >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-400/30">
                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 dark:text-white/40 font-black uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm text-slate-900 dark:text-white font-bold leading-tight line-clamp-2">Documents Ready, Checklist Verified</p>
                </div>
            </motion.div>

            {/* Top Right: Appointment Confirmed */}
            <motion.div
                style={{ x: cardRX, y: cardRY }}
                animate={{
                    y: [10, -10, 10],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                whileHover={{
                    scale: 1.05,
                    zIndex: 50,
                    transition: { duration: 0.3 }
                }}
                className="absolute -right-12 top-20 z-20 w-64 p-5 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-indigo-400/50 shadow-2xl flex items-center gap-4 pointer-events-auto cursor-pointer"
            >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 dark:text-white/40 font-black uppercase tracking-widest mb-1">Booking</p>
                    <p className="text-sm text-slate-900 dark:text-white font-bold leading-tight">Appointment Confirmed Tomorrow, 10:30 AM</p>
                </div>
            </motion.div>

            {/* Bottom Left: Nearby Branch */}
            <motion.div
                style={{ x: cardLX, y: cardLY }}
                animate={{
                    y: [5, -15, 5],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                whileHover={{
                    scale: 1.05,
                    zIndex: 50,
                    transition: { duration: 0.3 }
                }}
                className="absolute -left-20 bottom-1/4 z-20 w-64 p-5 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-indigo-400/50 shadow-2xl flex items-center gap-4 pointer-events-auto cursor-pointer"
            >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-400/30">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 dark:text-white/40 font-black uppercase tracking-widest mb-1">Navigation</p>
                    <p className="text-sm text-slate-900 dark:text-white font-bold leading-tight">Find Nearby Branch <span className="text-primary block">3 open slots</span></p>
                </div>
            </motion.div>

            {/* Bottom Right: Queue Status */}
            <motion.div
                style={{ x: cardRX, y: cardRY }}
                animate={{
                    y: [-15, 5, -15],
                }}
                transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                whileHover={{
                    scale: 1.05,
                    zIndex: 50,
                    transition: { duration: 0.3 }
                }}
                className="absolute -right-20 bottom-1/3 z-20 w-64 p-5 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-indigo-400/50 shadow-2xl flex items-center gap-4 pointer-events-auto cursor-pointer"
            >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-400/30">
                    <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 dark:text-white/40 font-black uppercase tracking-widest mb-1">Queue</p>
                    <p className="text-sm text-slate-900 dark:text-white font-bold leading-tight">Live Queue Status Real-Time Updates</p>
                </div>
            </motion.div>

            {/* NEW: Notification Card (Top Center-ish) */}
            <motion.div
                style={{ x: tabletX, y: tabletY }}
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                whileHover={{
                    scale: 1.05,
                    zIndex: 50,
                    transition: { duration: 0.3 }
                }}
                className="absolute left-1/4 -top-8 z-20 w-72 p-4 rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-2xl border border-indigo-400/50 shadow-2xl flex items-center gap-4 pointer-events-auto cursor-pointer"
            >
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-400/30">
                    <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <p className="text-[9px] text-slate-500 dark:text-white/40 font-black uppercase tracking-widest mb-0.5">Alert</p>
                    <p className="text-xs text-slate-900 dark:text-white font-bold leading-snug">Action Required: Complete Bank Verification</p>
                </div>
            </motion.div>

            {/* NEW: Secure Card (High Left) */}
            <motion.div
                style={{ x: cardLX, y: cardLY }}
                animate={{
                    y: [10, -10, 10],
                }}
                transition={{
                    duration: 7.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                whileHover={{
                    scale: 1.05,
                    zIndex: 50,
                    transition: { duration: 0.3 }
                }}
                className="absolute -left-28 top-[35%] z-20 w-60 p-4 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-indigo-400/50 shadow-2xl flex items-center gap-4 pointer-events-auto cursor-pointer"
            >
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="text-[9px] text-slate-500 dark:text-white/40 font-black uppercase tracking-widest mb-0.5">Trust</p>
                    <p className="text-xs text-slate-900 dark:text-white font-bold leading-snug">End-to-End Encryption Enabled</p>
                </div>
            </motion.div>

            {/* NEW: Time Slots Card (Mid Right) */}
            <motion.div
                style={{ x: cardRX, y: cardRY }}
                animate={{
                    y: [-12, 12, -12],
                }}
                transition={{
                    duration: 6.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                whileHover={{
                    scale: 1.05,
                    zIndex: 50,
                    transition: { duration: 0.3 }
                }}
                className="absolute -right-32 top-1/2 z-20 w-64 p-4 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-indigo-400/50 shadow-2xl flex items-center gap-4 pointer-events-auto cursor-pointer"
            >
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-400/30">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <p className="text-[9px] text-slate-500 dark:text-white/40 font-black uppercase tracking-widest mb-0.5">Availability</p>
                    <p className="text-xs text-slate-900 dark:text-white font-bold leading-snug">Next Slot: Today, 2:30 PM <span className="text-emerald-500 font-black ml-1">Live</span></p>
                </div>
            </motion.div>

            {/* NEW: Calendar Sync Card (Low Right) */}
            <motion.div
                style={{ x: cardRX, y: cardRY }}
                animate={{
                    y: [15, -15, 15],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                whileHover={{
                    scale: 1.05,
                    zIndex: 50,
                    transition: { duration: 0.3 }
                }}
                className="absolute -right-16 bottom-10 z-20 w-64 p-4 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-indigo-400/50 shadow-2xl flex items-center gap-4 pointer-events-auto cursor-pointer"
            >
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-400/30">
                    <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <p className="text-[9px] text-slate-500 dark:text-white/40 font-black uppercase tracking-widest mb-0.5">Integration</p>
                    <p className="text-xs text-slate-900 dark:text-white font-bold leading-snug">Sync with Google/Outlook Calendar</p>
                </div>
            </motion.div>

        </div>
    );
}
