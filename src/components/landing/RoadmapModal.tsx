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
    Database,
    Smartphone,
    Cpu,
    CheckCircle2,
    Circle
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const roadmapPhases = [
    {
        phase: "Phase 1 - 4",
        title: "The Foundation",
        status: "Completed",
        icon: Layers,
        items: [
            "Core Financial Architecture",
            "Interactive 3D Tablet Mockups",
            "Customer & Admin Dashboards",
            "Seamless Authentication System"
        ],
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20"
    },
    {
        phase: "Phase 5 - 7",
        title: "The Aesthetic Evolution",
        status: "Completed",
        icon: Palette,
        items: [
            "Elite Glass Redesign",
            "Dynamic Background Animations",
            "FAQ & Developers Portal Overhaul",
            "Premium Visual Identity across the platform"
        ],
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
        borderColor: "border-indigo-500/20"
    },
    {
        phase: "Phase 8",
        title: "Universal Sync",
        status: "In Progress",
        icon: RefreshCw,
        items: [
            "Branch Synchronization with Main",
            "Landing Page Component Integration",
            "Interactive Roadmap Module (Phase 8 Launch)",
            "Cross-Platform Visual Stability"
        ],
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
    },
    {
        phase: "Phase 9+",
        title: "Future Horizons",
        status: "Planned",
        icon: Cpu,
        items: [
            "AI-Powered Smart Scheduling",
            "Deep Bank-Side Integration APIs",
            "Native iOS & Android Mobile Apps",
            "Predictive Analytics for Branch Capacity"
        ],
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20"
    }
];

interface RoadmapModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RoadmapModal({ isOpen, onOpenChange }: RoadmapModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-[100px] shadow-2xl rounded-[2.5rem]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

                <ScrollArea className="h-full max-h-[90vh]">
                    <div className="p-8 md:p-12">
                        <DialogHeader className="mb-12 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                                    <Rocket className="h-8 w-8" strokeWidth={1.5} />
                                </div>
                            </div>
                            <DialogTitle className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                                The Stride Evolution
                            </DialogTitle>
                            <DialogDescription className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto line-relaxed">
                                Experience our planned milestones and the future vision for the next generation of Stride architecture.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="relative space-y-12">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-8 bottom-8 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

                            {roadmapPhases.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                    className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-start group"
                                >
                                    {/* Left Column: Icon & Phase (Desktop) */}
                                    <div className="md:col-span-1 hidden md:flex flex-col items-center">
                                        <div className={`relative z-10 w-12 h-12 rounded-full ${item.bgColor} border-2 ${item.borderColor} flex items-center justify-center ${item.color} shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                                            <item.icon className="w-6 h-6" strokeWidth={2} />
                                        </div>
                                    </div>

                                    {/* Right Column: Content Card */}
                                    <div className="md:col-span-11">
                                        <div className="relative overflow-hidden rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 p-8 shadow-xl transition-all duration-500 group-hover:bg-white/60 dark:group-hover:bg-slate-900/60">
                                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                                <div>
                                                    <span className={`text-xs font-bold uppercase tracking-widest ${item.color} mb-1 block`}>
                                                        {item.phase}
                                                    </span>
                                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${item.borderColor} ${item.bgColor} ${item.color}`}>
                                                    {item.status === "Completed" ? (
                                                        <span className="flex items-center gap-1.5">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5">
                                                            <Circle className="w-3.5 h-3.5 fill-current animate-pulse" /> {item.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {item.items.map((point, pIdx) => (
                                                    <li key={pIdx} className="flex items-start gap-3">
                                                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${item.color} shrink-0`} />
                                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                            {point}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-16 text-center pb-8 border-t border-slate-200/50 dark:border-white/5 pt-12">
                            <p className="text-slate-500 dark:text-slate-400 italic font-medium">
                                * Stride is constantly evolving. Future phases are subject to institutional integration timelines.
                            </p>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
