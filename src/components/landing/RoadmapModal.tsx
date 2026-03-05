"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
    Rocket,
    Layers,
    Palette,
    RefreshCw,
    Cpu,
    CheckCircle2,
    Network,
    Zap,
    ShieldCheck,
    Globe,
    BrainCircuit,
    Lock,
    ArrowRight,
    Sparkles,
    BarChart3,
    Smartphone,
    ChevronRight,
    ArrowRightLeft
} from "lucide-react";
import { FloatingDoodles } from "./FloatingDoodles";
import { useState, useRef } from "react";

const roadmapPhases = [
    {
        phase: "01",
        title: "Foundation",
        status: "Completed",
        icon: Layers,
        items: ["Financial Core", "3D Architecture", "Auth System"],
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        glow: "shadow-emerald-500/20"
    },
    {
        phase: "02",
        title: "Aesthetics",
        status: "Completed",
        icon: Palette,
        items: ["Elite Glass", "Motion Engine", "Help Center"],
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
        borderColor: "border-indigo-500/20",
        glow: "shadow-indigo-500/20"
    },
    {
        phase: "03",
        title: "Universal Sync",
        status: "Active",
        icon: RefreshCw,
        items: ["Landing Integration", "Roadmap Launch", "Cross-Platform"],
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        glow: "shadow-blue-500/20"
    },
    {
        phase: "04",
        title: "Global Scale",
        status: "Upcoming",
        icon: Cpu,
        items: ["AI Scheduling", "Bank APIs", "Mobile Apps"],
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        glow: "shadow-purple-500/20"
    }
];

const bentoCards = [
    {
        id: "security",
        title: "Institutional Security",
        icon: Lock,
        desc: "AES-256 Encryption",
        content: "Shielding every transaction with military-grade protocols.",
        color: "border-blue-500/20 bg-blue-500/5",
        accent: "text-blue-500"
    },
    {
        id: "ai",
        title: "AI Intelligence",
        icon: BrainCircuit,
        desc: "Neural Core",
        content: "Our neural core optimizes branch operations automatically.",
        color: "border-purple-500/20 bg-purple-500/5",
        accent: "text-purple-500"
    }
];

interface RoadmapModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RoadmapModal({ isOpen, onOpenChange }: RoadmapModalProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] lg:max-w-7xl h-[95vh] lg:h-[90vh] p-0 overflow-hidden border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[120px] shadow-2xl rounded-[3rem]">
                {/* Unified Landing Page Background */}
                <div className="absolute inset-0 z-0">
                    <FloatingDoodles />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1)_0%,transparent_50%)]" />
                </div>

                <div className="relative z-10 flex flex-col h-full items-center">
                    {/* Header - Centered & Premium */}
                    <div className="w-full px-8 pt-10 pb-6 flex flex-col items-center justify-center text-center shrink-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-4 py-2 rounded-full bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-white/10 backdrop-blur-xl mb-4 shadow-xl"
                        >
                            <span className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[9px]">
                                <Rocket className="w-3 h-3" /> Stride Evolution Roadmap
                            </span>
                        </motion.div>
                        <DialogTitle className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none text-center">
                            The Journey of <span className="text-primary italic">Innovation</span>
                        </DialogTitle>
                    </div>

                    {/* MAIN SCROLLABLE CONTENT AREA */}
                    <div className="flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-hide px-6 lg:px-12 py-4">
                        <div className="max-w-7xl mx-auto space-y-6 pb-12">

                            {/* TOP BENTO ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {bentoCards.map((card) => (
                                    <motion.div
                                        key={card.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-6 rounded-[2.5rem] border ${card.color} backdrop-blur-3xl flex items-start gap-4 shadow-lg hover:shadow-2xl transition-all duration-500`}
                                    >
                                        <div className={`p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20 ${card.accent}`}>
                                            <card.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{card.title}</h5>
                                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{card.desc}</p>
                                            <p className="text-[11px] font-medium text-slate-400 mt-2 leading-relaxed">{card.content}</p>
                                        </div>
                                    </motion.div>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-3xl flex items-center justify-between group shadow-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20 text-emerald-500">
                                            <Globe className="w-5 h-5 animate-spin-slow" />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Institutional Mesh</h5>
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Global Status: Active</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                                </motion.div>
                            </div>

                            {/* CENTRAL MASTER JOURNEY (HORIZONTAL SLIDER RESTORED & BETTER) */}
                            <div className="relative rounded-[3.5rem] bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-white/20 shadow-2xl backdrop-blur-3xl p-8 lg:p-12 overflow-hidden">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Sync Evolution Node</h4>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <ArrowRightLeft className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Swipe to Explore Journey</span>
                                    </div>
                                </div>

                                {/* HORIZONTAL SWIPE CONTAINER */}
                                <div
                                    ref={scrollRef}
                                    className="relative overflow-x-auto pb-12 pt-6 px-4 scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing"
                                >
                                    <div className="flex gap-8 items-start min-w-max pb-4">
                                        {/* Glowing Progress Background Line */}
                                        <div className="absolute top-[3.75rem] left-0 right-0 h-1 bg-slate-200/50 dark:bg-white/10 z-0 rounded-full mx-12">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "66%" }}
                                                transition={{ duration: 2, ease: "easeInOut" }}
                                                className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-blue-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] rounded-full"
                                            />
                                        </div>

                                        {roadmapPhases.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                                className="relative z-10 w-[280px] md:w-[340px] group snap-center"
                                            >
                                                {/* Node Icon */}
                                                <div className="flex justify-center mb-8">
                                                    <div className={`w-14 h-14 rounded-full ${item.bgColor} border-2 ${item.borderColor} flex items-center justify-center ${item.color} shadow-lg group-hover:scale-120 transition-all duration-500 relative bg-white dark:bg-slate-950`}>
                                                        <item.icon className="w-6 h-6 flex-shrink-0" />
                                                        {item.status === "Active" && (
                                                            <div className="absolute -inset-2 bg-blue-500/20 rounded-full animate-ping" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Node Card */}
                                                <div className={`relative p-8 rounded-[3rem] border border-white/50 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl shadow-xl transition-all duration-500 group-hover:-translate-y-2 ${item.glow}`}>
                                                    <div className="mb-4">
                                                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${item.color} block mb-1`}>
                                                            Node {item.phase}
                                                        </span>
                                                        <h5 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                                            {item.title}
                                                        </h5>
                                                    </div>

                                                    <div className="space-y-3 mb-8">
                                                        {item.items.map((point, pIdx) => (
                                                            <div key={pIdx} className="flex items-center gap-3">
                                                                <CheckCircle2 className={`w-3.5 h-3.5 ${item.status === "Upcoming" ? "text-slate-300 dark:text-slate-700" : item.color}`} />
                                                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                                                    {point}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black border ${item.borderColor} ${item.bgColor} ${item.color} uppercase tracking-widest`}>
                                                        {item.status}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM METRICS ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { icon: BarChart3, label: "Operational Load", val: "42%", sub: "Nodes Primary" },
                                    { icon: Network, label: "Network Health", val: "99.9%", sub: "Edge Encrypted" },
                                    { icon: Smartphone, label: "Mobile Sync", val: "ALPHA", sub: "V2.0.4" },
                                    { icon: ShieldCheck, label: "Safety Audit", val: "Passed", sub: "AES-256V" }
                                ].map((stat, i) => (
                                    <div key={i} className="p-6 rounded-[2.5rem] bg-white/30 dark:bg-slate-950/30 border border-white/10 flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                            <h6 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">{stat.val}</h6>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">{stat.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* Footer - Static Labels */}
                    <div className="w-full px-8 py-6 border-t border-white/5 bg-white/5 dark:bg-slate-950/5 backdrop-blur-md flex items-center justify-center shrink-0">
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em] text-center">
                            * Stride Evolution Protocol v8.4.1 • Global Innovation Sync © 2026
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
