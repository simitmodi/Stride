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
        title: "Security Core",
        icon: Lock,
        desc: "AES-256V",
        content: "Military-grade encryption protocols.",
        color: "border-blue-500/20 bg-blue-500/5",
        accent: "text-blue-500"
    },
    {
        id: "ai",
        title: "AI Neural Core",
        icon: BrainCircuit,
        desc: "V2.0.4",
        content: "Optimized branch operations.",
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
            <DialogContent className="max-w-[98vw] lg:max-w-7xl h-[92vh] p-0 overflow-hidden border-white/20 dark:border-white/10 bg-white shadow-2xl rounded-[2.5rem]">
                {/* Unified Landing Page Background */}
                <div className="absolute inset-0 z-0 bg-white">
                    <FloatingDoodles />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03)_0%,transparent_50%)]" />
                </div>

                <div className="relative z-10 flex flex-col h-full items-center">
                    {/* Header - Compact */}
                    <div className="w-full px-8 pt-6 pb-2 flex flex-col items-center justify-center text-center shrink-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 shadow-sm mb-3"
                        >
                            <span className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[8px]">
                                <Rocket className="w-3 h-3" /> Stride Evolution Roadmap
                            </span>
                        </motion.div>
                        <DialogTitle className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight text-center">
                            The Journey of <span className="text-primary italic">Innovation</span>
                        </DialogTitle>
                    </div>

                    {/* MAIN SCROLLABLE CONTENT AREA */}
                    <div className="flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-hide px-3 lg:px-8 py-2">
                        <div className="max-w-7xl mx-auto space-y-4 pb-12">

                            {/* TOP BENTO ROW - Fixed: Added px-2 and more fluid grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2">
                                {bentoCards.map((card) => (
                                    <motion.div
                                        key={card.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-[1.5rem] md:rounded-[2rem] border ${card.color} flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-500`}
                                    >
                                        <div className={`p-2 rounded-xl bg-white border border-slate-200 ${card.accent} shrink-0`}>
                                            <card.icon className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">{card.title}</h5>
                                            <p className="text-[10px] font-medium text-slate-500 leading-tight">{card.content}</p>
                                        </div>
                                    </motion.div>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-[1.5rem] md:rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between group shadow-sm col-sm-span-2 lg:col-span-1"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-500 shrink-0">
                                            <Globe className="w-4 h-4 animate-spin-slow" />
                                        </div>
                                        <div className="min-w-0">
                                            <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">Institutional Mesh</h5>
                                            <p className="text-[10px] font-medium text-emerald-600 truncate">Status: Active</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-1 transition-transform shrink-0" />
                                </motion.div>
                            </div>

                            {/* CENTRAL MASTER JOURNEY */}
                            <div className="relative mx-2 rounded-[2.5rem] bg-slate-50 border border-slate-200 shadow-xl p-4 lg:p-6 overflow-hidden">
                                <div className="flex items-center justify-between mb-4 px-4 overflow-hidden">
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Evolution Node</h4>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary animate-bounce-horizontal shrink-0">
                                        <ArrowRightLeft className="w-3 h-3" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Swipe</span>
                                    </div>
                                </div>

                                <div
                                    ref={scrollRef}
                                    className="relative overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing px-2"
                                >
                                    <div className="flex gap-4 items-start min-w-max pb-2 pr-48">
                                        {/* Progress Line */}
                                        <div className="absolute top-[2.75rem] left-0 right-0 h-0.5 bg-slate-200 z-0 rounded-full mx-8">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "66%" }}
                                                transition={{ duration: 2, ease: "easeInOut" }}
                                                className="h-full bg-primary shadow-[0_0_15px_rgba(99,102,241,0.4)] rounded-full"
                                            />
                                        </div>

                                        {roadmapPhases.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                                className="relative z-10 w-[200px] md:w-[240px] group snap-start"
                                            >
                                                <div className="flex justify-center mb-5">
                                                    <div className={`w-9 h-9 rounded-full ${item.bgColor} border-2 ${item.borderColor} flex items-center justify-center ${item.color} shadow-sm bg-white relative`}>
                                                        <item.icon className="w-4 h-4 flex-shrink-0" />
                                                    </div>
                                                </div>

                                                <div className={`relative p-5 rounded-[2rem] border border-slate-200 bg-white shadow-md transition-all duration-500 group-hover:-translate-y-1 ${item.glow}`}>
                                                    <div className="mb-2">
                                                        <span className={`text-[7px] font-black uppercase tracking-[0.2em] ${item.color} block mb-0.5`}>
                                                            Node {item.phase}
                                                        </span>
                                                        <h5 className="text-[14px] font-black text-slate-900 tracking-tight leading-none">
                                                            {item.title}
                                                        </h5>
                                                    </div>
                                                    <div className="space-y-1.5 mb-4">
                                                        {item.items.map((point, pIdx) => (
                                                            <div key={pIdx} className="flex items-center gap-2">
                                                                <CheckCircle2 className={`w-2.5 h-2.5 ${item.status === "Upcoming" ? "text-slate-100" : item.color}`} />
                                                                <span className="text-[9px] font-semibold text-slate-500 truncate">
                                                                    {point}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className={`inline-flex px-2.5 py-0.5 rounded-full text-[7px] font-black border ${item.borderColor} ${item.bgColor} ${item.color} uppercase tracking-widest`}>
                                                        {item.status}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM METRICS ROW - Fixed: Added px-2 and fluid col-spanning */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4">
                                {[
                                    { icon: BarChart3, label: "Operational Load", val: "42%", sub: "Nodes" },
                                    { icon: Network, label: "Network Health", val: "99.9%", sub: "Encrypted" },
                                    { icon: Smartphone, label: "Mobile Sync", val: "ALPHA", sub: "V2.0.4" },
                                    { icon: ShieldCheck, label: "Safety Audit", val: "Passed", sub: "AES-256V" }
                                ].map((stat, i) => (
                                    <div key={i} className="p-3 rounded-[1.25rem] bg-slate-50 border border-slate-200 flex items-center gap-3 group shadow-sm">
                                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                                            <stat.icon className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{stat.label}</p>
                                            <h6 className="text-[12px] font-black text-slate-900 tracking-tighter leading-none mt-0.5">{stat.val}</h6>
                                            <p className="text-[7px] font-bold text-slate-500 uppercase mt-0.5 truncate">{stat.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* Footer - Precise Static Labels */}
                    <div className="w-full px-8 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-center shrink-0">
                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.5em] text-center">
                            * Stride Evolution Protocol v8.4.1 • Global Innovation Sync © 2026
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
