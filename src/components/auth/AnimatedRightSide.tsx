'use client';

import { motion, Transition, AnimatePresence } from 'framer-motion';
import { 
    Search, Loader2, Sparkles, CheckCircle, Calendar, FileText, 
    Shield, Activity, Clock, Lock, UserCheck, BarChart, MapPin, 
    CreditCard, TrendingUp, Zap, Settings, HelpCircle, Bell, 
    Smartphone, Globe, ShieldCheck, PieChart, Wallet, Briefcase, 
    Trophy, MessageCircle, Heart, Star, Send, Layers, RefreshCw
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

const TOOLTIP_DATA = [
    { icon: Sparkles, label: "AI AGENT", text: "Found 3 open slots at CG Road!", color: "bg-orange-100", iconColor: "text-orange-500" },
    { icon: Calendar, label: "BOOKING", text: "Appointment confirmed: March 15th", color: "bg-indigo-100", iconColor: "text-indigo-500" },
    { icon: FileText, label: "KYC CHECK", text: "Aadhaar & PAN: 2/2 verified", color: "bg-emerald-100", iconColor: "text-emerald-500" },
    { icon: UserCheck, label: "STAFF", text: "Amit Patel updated availability", color: "bg-blue-100", iconColor: "text-blue-500" },
    { icon: Clock, label: "TRANSPARENCY", text: "Live slot visibility: Active", color: "bg-rose-100", iconColor: "text-rose-500" },
    { icon: ShieldCheck, label: "SECURITY", text: "RBI compliant data storage", color: "bg-cyan-100", iconColor: "text-cyan-500" },
    { icon: Zap, label: "EFFICIENCY", text: "No more long bank queues!", color: "bg-amber-100", iconColor: "text-amber-500" },
    { icon: Smartphone, label: "MOBILE", text: "Book via Stride from anywhere", color: "bg-purple-100", iconColor: "text-purple-500" },
    { icon: BarChart, label: "REPORTS", text: "Branch footfall: Low (Safe visit)", color: "bg-lime-100", iconColor: "text-lime-500" },
    { icon: MapPin, label: "BRANCH", text: "Nearest Prahlad Nagar branch open", color: "bg-orange-100", iconColor: "text-orange-600" },
    { icon: Briefcase, label: "STAFF VIEW", text: "Manage all daily appointments", color: "bg-indigo-100", iconColor: "text-indigo-600" },
    { icon: HelpCircle, label: "SUPPORT", text: "Need help with your visit?", color: "bg-emerald-100", iconColor: "text-emerald-600" },
    { icon: Bell, label: "ALERTS", text: "Reminder: Visit in 2 hours", color: "bg-yellow-100", iconColor: "text-yellow-600" },
    { icon: CheckCircle, label: "DASHBOARD", text: "User-friendly client interface", color: "bg-slate-100", iconColor: "text-slate-600" },
    { icon: Globe, label: "ONLINE", text: "24/7 self-service scheduling", color: "bg-sky-100", iconColor: "text-sky-600" },
    { icon: PieChart, label: "ANALYTICS", text: "Peak hours: 11AM - 1PM", color: "bg-pink-100", iconColor: "text-pink-600" },
    { icon: Wallet, label: "ACCOUNT", text: "Link your Savings profile", color: "bg-teal-100", iconColor: "text-teal-600" },
    { icon: FileText, label: "DOCUMENTS", text: "Voter ID/Passport uploaded", color: "bg-blue-100", iconColor: "text-blue-600" },
    { icon: Heart, label: "PREMIUM", text: "Priority slots for Senior Citizens", color: "bg-green-100", iconColor: "text-green-600" },
    { icon: MessageCircle, label: "CHAT", text: "Agent: Available for queries", color: "bg-violet-100", iconColor: "text-violet-600" },
    { icon: Layers, label: "SIMPLICITY", text: "One-click rescheduling", color: "bg-orange-100", iconColor: "text-orange-500" },
    { icon: Activity, label: "REAL-TIME", text: "Slot freed at Satellite branch", color: "bg-indigo-100", iconColor: "text-indigo-500" },
    { icon: Shield, label: "PRIVACY", text: "Personal data highly protected", color: "bg-yellow-100", iconColor: "text-yellow-600" },
    { icon: TrendingUp, label: "GROWTH", text: "Over 10k Amdavadis use Stride", color: "bg-sky-100", iconColor: "text-sky-500" },
    { icon: Lock, label: "PORTAL", text: "Staff portal: Secure Login", color: "bg-red-100", iconColor: "text-red-500" },
    { icon: RefreshCw, label: "SYNC", text: "Calendar synced with G-Cal", color: "bg-amber-100", iconColor: "text-amber-500" },
    { icon: Send, label: "SMS", text: "Booking SMS sent to mobile", color: "bg-blue-200", iconColor: "text-blue-700" },
    { icon: Star, label: "SURVEY", text: "Rate your branch experience", color: "bg-emerald-100", iconColor: "text-emerald-500" },
    { icon: Trophy, label: "STATUS", text: "Elite member perks active", color: "bg-slate-200", iconColor: "text-slate-700" },
    { icon: Sparkles, label: "AI SLOT", text: "Better time suggest found", color: "bg-indigo-50", iconColor: "text-indigo-400" },
    { icon: FileText, label: "E-SIGN", text: "Digital signatures verified", color: "bg-gray-100", iconColor: "text-gray-500" },
    { icon: Clock, label: "WAIT TIME", text: "Zero-wait check-in active", color: "bg-red-50", iconColor: "text-red-600" },
    { icon: CheckCircle, label: "APPROVED", text: "Home Loan meeting finalized", color: "bg-green-50", iconColor: "text-green-600" },
    { icon: UserCheck, label: "STAFF", text: "Priyanka Shah available now", color: "bg-yellow-50", iconColor: "text-yellow-600" },
    { icon: ShieldCheck, label: "KYC COMP.", text: "Video KYC pre-verified", color: "bg-neutral-100", iconColor: "text-neutral-600" },
    { icon: BarChart, label: "TRAFFIC", text: "Busy day today at GIFT City", color: "bg-blue-50", iconColor: "text-blue-400" },
    { icon: Globe, label: "WEB APP", text: "Access in English & Gujarati", color: "bg-cyan-50", iconColor: "text-cyan-600" },
    { icon: Smartphone, label: "APP", text: "WhatsApp update: 1h left", color: "bg-indigo-50", iconColor: "text-indigo-400" },
    { icon: Lock, label: "VERIFY", text: "Digital locker access match", color: "bg-green-50", iconColor: "text-green-500" },
    { icon: Calendar, label: "HISTORY", text: "View past bank visits", color: "bg-blue-50", iconColor: "text-blue-800" },
    { icon: Wallet, label: "PROFILE", text: "Banking info encrypted", color: "bg-purple-50", iconColor: "text-purple-400" },
    { icon: Briefcase, label: "WORKFLOW", text: "Assign specialists instantly", color: "bg-emerald-50", iconColor: "text-emerald-400" },
    { icon: Zap, label: "STRIDE", text: "Fast-track bank processes", color: "bg-amber-50", iconColor: "text-amber-400" },
    { icon: PieChart, label: "INSIGHTS", text: "Service speed improved", color: "bg-yellow-100", iconColor: "text-yellow-500" },
    { icon: MessageCircle, label: "QA", text: "Query: Account opening?", color: "bg-sky-50", iconColor: "text-sky-400" },
    { icon: Settings, label: "AVAIL", text: "Lunch hours excluded", color: "bg-slate-50", iconColor: "text-slate-400" },
    { icon: HelpCircle, label: "GUIDE", text: "Branch map navigation", color: "bg-blue-50", iconColor: "text-blue-300" },
    { icon: Bell, label: "CANCEL", text: "Satellite slot opened", color: "bg-rose-50", iconColor: "text-rose-400" },
    { icon: Send, label: "E-MAIL", text: "Confirmed e-mail sent", color: "bg-indigo-50", iconColor: "text-indigo-400" },
    { icon: Layers, label: "ADMIN", text: "Ahmedabad control active", color: "bg-emerald-50", iconColor: "text-emerald-500" },
];

const POSITIONS = [
    { top: "-10%", left: "-140px", rotate: -1 },
    { top: "15%", right: "-150px", rotate: 1 },
    { top: "65%", right: "-160px", rotate: -1 },
    { top: "45%", left: "-180px", rotate: 1 },
    { bottom: "-10%", left: "-130px", rotate: -1 }
];

export function AnimatedRightSide() {
    const [visibleIndices, setVisibleIndices] = useState<number[]>([0, 1, 2, 3, 4]);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleIndices(prev => {
                const next = [...prev];
                // Replace 1-2 random indices with new random unique ones
                const replaceCount = Math.floor(Math.random() * 2) + 1;
                for (let i = 0; i < replaceCount; i++) {
                    const idxToReplace = Math.floor(Math.random() * 5);
                    let newIdx;
                    do {
                        newIdx = Math.floor(Math.random() * TOOLTIP_DATA.length);
                    } while (next.includes(newIdx));
                    next[idxToReplace] = newIdx;
                }
                return next;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const floatingTransition: Transition = {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "reverse"
    };

    return (
        <div 
            className="hidden lg:flex lg:w-1/2 bg-[#0a0a0a] relative items-center justify-center overflow-hidden h-screen sticky top-0"
        >
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover opacity-[0.1] mix-blend-screen scale-110"
                    src="https://cdn.pixabay.com/video/2020/05/25/40141-424759714_large.mp4"
                />
                
                <motion.div 
                    animate={{ y: [-10, 10], x: [-5, 5] }}
                    transition={floatingTransition}
                    className="absolute top-1/4 -right-20 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]"
                />
                <motion.div 
                    animate={{ y: [10, -10], x: [5, -5] }}
                    transition={{ ...floatingTransition, delay: 1 }}
                    className="absolute -bottom-32 -left-32 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]"
                />
                
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 w-full max-w-xl px-8 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <h2
                        className="text-5xl lg:text-6xl tracking-tight text-white mb-6 font-medium leading-tight"
                        style={{ fontFamily: 'var(--font-headline), Georgia, serif' }}
                    >
                        Seamless Bank<br /> Appointments
                    </h2>
                    <p
                        className="text-zinc-400 text-xl max-w-md mx-auto"
                        style={{ fontFamily: 'var(--font-headline), Georgia, serif' }}
                    >
                        Book and manage bank appointments effortlessly with our unified platform.
                    </p>
                </motion.div>

                <motion.div 
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-full max-w-sm rounded-[24px] border border-white/10 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-2xl"
                >
                    <div className="flex items-center gap-2 mb-6 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
                        <Search className="h-4 w-4 text-white/30" />
                        <span className="text-xs font-medium text-white/30">Search Appointments...</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                            { icon: FileText, label: "Checklists", color: "bg-indigo-500" },
                            { icon: Calendar, label: "Slots", color: "bg-indigo-500" },
                            { icon: Sparkles, label: "Support", color: "bg-sky-500" },
                            { icon: CheckCircle, label: "Verified", color: "bg-sky-500" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-2.5 p-4 rounded-[20px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-colors cursor-pointer group">
                                <div className={`${item.color} h-11 w-11 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <item.icon className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live Status</span>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
                                <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "65%" }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full border border-sky-400/50 bg-sky-400/20" />
                                <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "85%" }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="h-full bg-sky-400" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Dynamic Floating Tooltips ── */}
                    <AnimatePresence>
                        {visibleIndices.map((dataIndex, i) => {
                            const data = TOOLTIP_DATA[dataIndex];
                            const pos = POSITIONS[i];
                            return (
                                <motion.div
                                    key={`${i}-${dataIndex}`}
                                    initial={{ opacity: 0, scale: 0.8, x: pos.left?.includes('-') ? -20 : 20 }}
                                    animate={{ 
                                        opacity: 1, 
                                        scale: 1, 
                                        x: 0,
                                        y: [0, (i % 2 === 0 ? -8 : 8), 0],
                                        rotate: [pos.rotate, -pos.rotate, pos.rotate]
                                    }}
                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                                    transition={{ 
                                        duration: 0.5,
                                        y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
                                        rotate: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="absolute z-20 flex flex-col rounded-2xl border border-white/10 bg-white p-4 shadow-2xl"
                                    style={{ 
                                        top: pos.top, 
                                        left: pos.left, 
                                        right: pos.right, 
                                        bottom: pos.bottom 
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`${data.color} p-2 rounded-lg`}>
                                            <data.icon className={`h-4 w-4 ${data.iconColor}`} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{data.label}</span>
                                            <span className="text-xs font-semibold text-gray-900 w-32">{data.text}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

// Stride: Professional Financial Connectivity
