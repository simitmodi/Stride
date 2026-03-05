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
    Smartphone
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FloatingDoodles } from "./FloatingDoodles";
import { useState } from "react";

const roadmapPhases = [
    {
        phase: "01",
        title: "Foundation",
        status: "Completed",
        icon: Layers,
        items: ["Financial Core", "3D Architecture", "Auth System"],
        color: "text-emerald-500",
        glow: "shadow-emerald-500/20"
    },
    {
        phase: "02",
        title: "Aesthetics",
        status: "Completed",
        icon: Palette,
        items: ["Elite Glass", "Motion Engine", "Help Center"],
        color: "text-indigo-500",
        glow: "shadow-indigo-500/20"
    },
    {
        phase: "03",
        title: "Universal Sync",
        status: "Active",
        icon: RefreshCw,
        items: ["Landing Integration", "Roadmap Launch", "Cross-Platform"],
        color: "text-blue-500",
        glow: "shadow-blue-500/20"
    },
    {
        phase: "04",
        title: "Global Scale",
        status: "Upcoming",
        icon: Cpu,
        items: ["AI Scheduling", "Bank APIs", "Mobile Apps"],
        color: "text-purple-500",
        glow: "shadow-purple-500/20"
    }
];

const bentoCards = [
    {
        id: "security",
        title: "Institutional Security",
        icon: Lock,
        desc: "AES-256 Banking Grade Encryption",
        content: "Shielding every transaction with military-grade protocols and real-time fraud detection.",
        size: "col-span-1 row-span-1",
        color: "border-blue-500/20 bg-blue-500/5"
    },
    {
        id: "ai",
        title: "AI Intelligence",
        icon: BrainCircuit,
        desc: "Predictive Capacity Mapping",
        content: "Our neural core optimizes branch operations and customer scheduling automatically.",
        size: "col-span-1 row-span-1",
        color: "border-purple-500/20 bg-purple-500/5"
    },
    {
        id: "global",
        title: "Global Horizons",
        icon: Globe,
        desc: "Institutional Mesh Networking",
        content: "Phase 9+ will see the launch of our cross-border liquidity network and international bank pipes.",
        size: "col-span-2 row-span-1",
        color: "border-emerald-500/20 bg-emerald-500/5"
    }
];

interface RoadmapModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RoadmapModal({ isOpen, onOpenChange }: RoadmapModalProps) {
    const [activeTab, setActiveTab] = useState(roadmapPhases[2].title);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] lg:max-w-[1400px] h-[95vh] lg:h-[90vh] p-0 overflow-hidden border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[120px] shadow-2xl rounded-[3rem]">
                {/* Unified Landing Page Background */}
                <div className="absolute inset-0 z-0">
                    <FloatingDoodles />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                </div>

                <div className="relative z-10 flex flex-col h-full items-center">
                    {/* Header */}
                    <div className="w-full px-8 pt-12 pb-8 flex flex-col items-center justify-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-4 py-2 rounded-full bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-white/10 backdrop-blur-xl mb-6 shadow-xl"
                        >
                            <span className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                                <Sparkles className="w-3 h-3" /> Stride Evolution Journey
                            </span>
                        </motion.div>
                        <DialogTitle className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-none text-center">
                            The Future <span className="text-primary italic">Syncs</span> Now
                        </DialogTitle>
                    </div>

                    <ScrollArea className="flex-1 w-full overflow-hidden">
                        <div className="w-full px-6 lg:px-12 py-6">
                            {/* Premium Bento Grid Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                                {/* 1. Left Feature Cards (Mobile Hidden or Stacked) */}
                                <div className="lg:col-span-3 flex flex-col gap-6">
                                    {bentoCards.slice(0, 2).map((card) => (
                                        <motion.div
                                            key={card.id}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-8 rounded-[2.5rem] border ${card.color} backdrop-blur-2xl flex flex-col justify-between group h-full shadow-lg hover:shadow-2xl transition-all duration-500`}
                                        >
                                            <div>
                                                <div className="w-12 h-12 rounded-2xl bg-white/40 dark:bg-slate-900/40 flex items-center justify-center mb-6 border border-white/20 group-hover:rotate-12 transition-transform duration-500 shadow-sm">
                                                    <card.icon className="w-6 h-6 text-primary" />
                                                </div>
                                                <h5 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{card.title}</h5>
                                                <p className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">{card.desc}</p>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {card.content}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* 2. CENTER PIECE: THE MASTER EVOLUTION HUB */}
                                <div className="lg:col-span-6 flex flex-col">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex-1 rounded-[3.5rem] bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-white/20 shadow-2xl backdrop-blur-3xl p-8 lg:p-12 relative overflow-hidden flex flex-col justify-between min-h-[500px]"
                                    >
                                        {/* Inner HUD Glow */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_100%)] pointer-events-none" />

                                        <div>
                                            <div className="flex justify-between items-center mb-12">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                                                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Mainstream Sync Active</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Current Node</span>
                                                    <p className="text-sm font-black text-primary uppercase">PHASE 08 (LIVE)</p>
                                                </div>
                                            </div>

                                            {/* Main Timeline Navigation */}
                                            <div className="space-y-6">
                                                {roadmapPhases.map((phase) => (
                                                    <motion.button
                                                        key={phase.title}
                                                        onClick={() => setActiveTab(phase.title)}
                                                        className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 group ${activeTab === phase.title
                                                                ? "bg-primary border-primary shadow-[0_20px_40px_rgba(99,102,241,0.3)]"
                                                                : "bg-white/40 dark:bg-slate-900/40 border-white/20 hover:border-primary/50"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <span className={`text-2xl font-black ${activeTab === phase.title ? "text-white" : "text-slate-300 dark:text-slate-700"} tracking-tighter`}>
                                                                {phase.phase}
                                                            </span>
                                                            <div className="text-left">
                                                                <h4 className={`text-xl font-bold tracking-tight ${activeTab === phase.title ? "text-white" : "text-slate-900 dark:text-white"}`}>
                                                                    {phase.title}
                                                                </h4>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <phase.icon className={`w-3 h-3 ${activeTab === phase.title ? "text-white/80" : "text-primary"}`} />
                                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === phase.title ? "text-white/60" : "text-slate-400"}`}>
                                                                        {phase.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <ArrowRight className={`w-5 h-5 transition-transform duration-500 ${activeTab === phase.title ? "text-white translate-x-1" : "text-slate-300 group-hover:text-primary"}`} />
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Active Detail Footer */}
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeTab}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="mt-12 p-8 rounded-[2rem] bg-slate-900/10 dark:bg-white/5 border border-white/10 flex items-center justify-between"
                                            >
                                                <div className="flex gap-4">
                                                    {roadmapPhases.find(p => p.title === activeTab)?.items.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 dark:bg-white/5 border border-white/10">
                                                            <CheckCircle2 className="w-3 h-3 text-primary" />
                                                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <BarChart3 className="w-8 h-8 text-primary/30" />
                                            </motion.div>
                                        </AnimatePresence>
                                    </motion.div>
                                </div>

                                {/* 3. Right & Bottom Features */}
                                <div className="lg:col-span-3 flex flex-col gap-6">
                                    {/* Global Card (Wide on Bottom or Tall on Right) */}
                                    <div className="lg:col-span-3 flex flex-col gap-6 h-full">
                                        {bentoCards.slice(2).map((card) => (
                                            <motion.div
                                                key={card.id}
                                                initial={{ opacity: 0, x: 30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`p-8 rounded-[2.5rem] border ${card.color} backdrop-blur-2xl flex flex-col justify-between group h-full shadow-lg hover:shadow-2xl transition-all duration-500`}
                                            >
                                                <div>
                                                    <div className="w-12 h-12 rounded-2xl bg-white/40 dark:bg-slate-900/40 flex items-center justify-center mb-6 border border-white/20 group-hover:rotate-12 transition-transform duration-500 shadow-sm">
                                                        <card.icon className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <h5 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{card.title}</h5>
                                                    <p className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">{card.desc}</p>
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        {card.content}
                                                    </p>
                                                </div>

                                                <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4 text-primary">
                                                    <Globe className="w-8 h-8 animate-spin-slow" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Mesh Active</span>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* Secondary Detail Card */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-8 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 border border-white/20 backdrop-blur-xl flex items-center gap-6 group hover:border-primary/40 transition-all shadow-lg"
                                        >
                                            <div className="p-4 rounded-2xl bg-primary text-white shadow-[0_10px_20px_rgba(99,102,241,0.4)]">
                                                <Smartphone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h6 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Mobile App</h6>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alpha Testing</p>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>

                    {/* Footer UI - Premium Branding */}
                    <div className="w-full px-8 py-8 border-t border-white/10 bg-white/10 dark:bg-slate-950/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Infrastructure Stability: 99.9%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Main Branch: SYNCED</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">
                            * Phase 08 Release • Stride Ecosystem © 2026
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
