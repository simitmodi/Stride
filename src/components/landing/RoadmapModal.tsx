"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
    Rocket,
    Layers,
    Palette,
    RefreshCw,
    Cpu,
    CheckCircle2,
    Network,
    Zap,
    ShieldCheck
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FloatingDoodles } from "./FloatingDoodles";
import { useRef } from "react";

const roadmapPhases = [
    {
        phase: "Phase 1 - 4",
        title: "Foundation",
        status: "Completed",
        icon: Layers,
        items: ["Financial Core", "3D Architecture", "Dashboards", "Auth System"],
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        glow: "shadow-emerald-500/20"
    },
    {
        phase: "Phase 5 - 7",
        title: "Aesthetics",
        status: "Completed",
        icon: Palette,
        items: ["Elite Glass", "Dynamic Motion", "Help Center", "Dev Portal"],
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
        borderColor: "border-indigo-500/20",
        glow: "shadow-indigo-500/20"
    },
    {
        phase: "Phase 8",
        title: "The Sync",
        status: "Active",
        icon: RefreshCw,
        items: ["Main Branch Sync", "Landing Integration", "Roadmap Launch", "Cross-Platform"],
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        glow: "shadow-blue-500/20"
    },
    {
        phase: "Phase 9+",
        title: "Scale",
        status: "Upcoming",
        icon: Cpu,
        items: ["AI Scheduling", "Bank APIs", "Mobile Apps", "Predictive Analytics"],
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        glow: "shadow-purple-500/20"
    }
];

const ecosystemItems = [
    { icon: ShieldCheck, label: "Banking Grade Security", desc: "AES-256 Encryption" },
    { icon: Zap, label: "Ultra-Low Latency", desc: "Edge Computing" },
    { icon: Network, label: "Institutional Mesh", desc: "Direct Bank Pipes" }
];

interface RoadmapModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RoadmapModal({ isOpen, onOpenChange }: RoadmapModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] lg:max-w-6xl h-[90vh] lg:h-[85vh] p-0 overflow-hidden border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[120px] shadow-2xl rounded-[3rem]">
                {/* Unified Landing Page Background */}
                <div className="absolute inset-0 z-0">
                    <FloatingDoodles />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="px-8 pt-12 pb-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <Rocket className="w-4 h-4" /> Stride Evolution Journey
                        </motion.div>
                        <DialogTitle className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 px-4 leading-none">
                            Building the Future of Banking
                        </DialogTitle>
                    </div>

                    <ScrollArea className="flex-1 w-full">
                        <div className="px-8 py-10">
                            {/* Milestone Slider */}
                            <div className="relative flex gap-8 items-start min-w-max pb-12 pt-10 px-4">
                                {/* Horizontal Progress Line */}
                                <div className="absolute top-[4.5rem] left-0 right-0 h-1 bg-slate-200/50 dark:bg-white/10 z-0 rounded-full mx-12">
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
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.15, duration: 0.8 }}
                                        className="relative z-10 w-[280px] md:w-[320px] group"
                                    >
                                        {/* Node */}
                                        <div className="flex justify-center mb-8 text-center items-center">
                                            <div className={`w-12 h-12 rounded-full ${item.bgColor} border-2 ${item.borderColor} flex items-center justify-center ${item.color} shadow-lg group-hover:scale-125 transition-all duration-500 relative bg-white dark:bg-slate-950`}>
                                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                                {item.status === "Active" && (
                                                    <div className="absolute -inset-2 bg-blue-500/20 rounded-full animate-ping" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Card */}
                                        <div className={`relative p-6 rounded-[2.5rem] border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl ${item.glow}`}>
                                            <div className="mb-4 text-left">
                                                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${item.color} block mb-1`}>
                                                    {item.phase}
                                                </span>
                                                <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                                                    {item.title}
                                                </h4>
                                            </div>

                                            <div className="space-y-2 mb-6">
                                                {item.items.map((point, pIdx) => (
                                                    <div key={pIdx} className="flex items-center gap-2">
                                                        <CheckCircle2 className={`w-3.5 h-3.5 ${item.status === "Upcoming" ? "text-slate-300 dark:text-slate-700" : item.color}`} />
                                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                                            {point}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold border ${item.borderColor} ${item.bgColor} ${item.color}`}>
                                                {item.status}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Bento Grid Footer */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 px-4 pb-12">
                                {ecosystemItems.map((eko, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 + i * 0.1 }}
                                        className="p-6 rounded-[2rem] border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 flex items-center gap-4 group hover:bg-white/50 dark:hover:bg-slate-900/50 transition-all duration-500"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:rotate-12 transition-transform duration-500">
                                            <eko.icon className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <h5 className="text-sm font-bold text-slate-900 dark:text-white">{eko.label}</h5>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{eko.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <ScrollBar orientation="horizontal" className="hidden" />
                    </ScrollArea>

                    {/* Bottom Caption */}
                    <div className="px-8 py-6 text-center border-t border-slate-200/50 dark:border-white/5">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase">
                            * Phase 8 synchronized with origin/main • High-performance infrastructure active
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
