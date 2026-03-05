"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Github,
    Linkedin,
    Globe,
    Mail,
    ArrowRight,
    Home,
    Code2,
    Palette,
    Terminal,
    Cpu,
    ShieldCheck,
    Database,
    Instagram,
    Crown,
    Layout,
    Layers,
    Zap,
    Component,
    Paintbrush
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";

const developers = [
    {
        name: "Simit Modi",
        role: "Frontend & Backend",
        contribution: "The visionary leader of the Stride development team, coordinating all project phases and technical architecture.",
        github: "https://github.com/simitmodi",
        linkedin: "https://www.linkedin.com/in/simitmodi/",
        portfolio: "https://simitmodi.vercel.app/",
        instagram: "https://www.instagram.com/simit.io/",
        icon: Crown,
        color: "bg-amber-500/20 text-amber-500",
    },
    {
        name: "Hardi Patel",
        role: "Frontend & UI Design",
        contribution: "Spearheaded the visual identity of Stride, focusing on the seamless blend of intuitive UI layouts and responsive frontend components.",
        github: "https://github.com/hardipatel2510",
        linkedin: "https://www.linkedin.com/in/hardipatel2510/",
        portfolio: "https://hardipatel.vercel.app/",
        instagram: "https://www.instagram.com/hardiptl.io/",
        icon: Layout,
        color: "bg-indigo-500/20 text-indigo-500",
    },
    {
        name: "Bansari Makwana",
        role: "Frontend & UI Design",
        contribution: "Crafted the elegant glassmorphic components and ensured a consistent, high-fidelity user experience across all platform interfaces.",
        github: "https://github.com/MakwBansari",
        linkedin: "https://www.linkedin.com/in/bansimakwana/",
        portfolio: "#",
        instagram: "https://www.instagram.com/bansiiii_._/",
        icon: Layers,
        color: "bg-blue-500/20 text-blue-500",
    },
    {
        name: "Ankit Nandoliya",
        role: "Frontend & UI Design",
        contribution: "Specialized in bridge-building between design and code, implementing precise layouts and fluid interactive elements.",
        github: "https://github.com/ankit5287",
        linkedin: "https://www.linkedin.com/in/ankit-nandoliya-425a1429b/",
        portfolio: "#",
        instagram: "https://www.instagram.com/ankit_n2/",
        icon: Zap,
        color: "bg-emerald-500/20 text-emerald-500",
    },
    {
        name: "Sharvi Bhavsar",
        role: "Frontend & UI Design",
        contribution: "Focused on the structural integrity of the frontend, ensuring that the bespoke UI designs translated perfectly into functional, high-performance code.",
        github: "https://github.com/sharvibhavsar",
        linkedin: "https://www.linkedin.com/in/sharvi-bhavsar-914344344/",
        portfolio: "#",
        instagram: "https://www.instagram.com/sharvi1206/",
        icon: Component,
        color: "bg-purple-500/20 text-purple-500",
    },
    {
        name: "Krishna Patel",
        role: "Canvas",
        contribution: "Dedicated to the creative 'Canvas' of the project, focusing on the artistic layout and visual storytelling elements that make Stride unique.",
        github: "#",
        linkedin: "#",
        portfolio: "#",
        instagram: "https://www.instagram.com/__krishna276/",
        icon: Paintbrush,
        color: "bg-rose-500/20 text-rose-500",
    },
];

export default function DevelopersPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 py-24">
            {/* Background Layers */}
            <div className="absolute inset-0 z-0">
                <FloatingDoodles />
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            </div>

            <main className="relative z-10 w-full max-w-7xl flex flex-col items-center">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center mb-20"
                >
                    <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter drop-shadow-sm">
                        Meet the Developers
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        The visionary team behind Stride's elite banking experience.
                    </p>
                </motion.div>

                {/* Developers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {developers.map((dev, index) => (
                        <motion.div
                            key={dev.name}
                            initial={{ opacity: 0, y: 40, rotateX: -5 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                            className="group relative h-full"
                        >
                            {/* Outer Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

                            <div className="relative h-full flex flex-col p-8 rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl shadow-2xl transition-all duration-500 group-hover:bg-white/70 dark:group-hover:bg-slate-900/60 overflow-hidden">

                                {/* Header: Icon & Name */}
                                <div className="flex items-center gap-5 mb-6">
                                    <div className={`w-14 h-14 rounded-2xl ${dev.color} flex items-center justify-center border border-white/20 shadow-lg transition-transform group-hover:scale-110 duration-500`}>
                                        <dev.icon className="w-7 h-7" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{dev.name}</h3>
                                        <span className="text-sm font-semibold text-primary/80 uppercase tracking-widest">{dev.role}</span>
                                    </div>
                                </div>

                                {/* Contribution */}
                                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8 flex-grow">
                                    {dev.contribution}
                                </p>

                                {/* Social Links */}
                                <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-white/5">
                                    <div className="flex gap-4">
                                        <Link href={dev.github} className="p-2 rounded-full hover:bg-primary/10 text-slate-400 hover:text-primary transition-all">
                                            <Github className="w-5 h-5" />
                                        </Link>
                                        <Link href={dev.linkedin} className="p-2 rounded-full hover:bg-primary/10 text-slate-400 hover:text-primary transition-all">
                                            <Linkedin className="w-5 h-5" />
                                        </Link>
                                        <Link href={dev.portfolio} className="p-2 rounded-full hover:bg-primary/10 text-slate-400 hover:text-primary transition-all">
                                            <Globe className="w-5 h-5" />
                                        </Link>
                                        {dev.instagram && (
                                            <Link href={dev.instagram} className="p-2 rounded-full hover:bg-primary/10 text-slate-400 hover:text-primary transition-all">
                                                <Instagram className="w-5 h-5" />
                                            </Link>
                                        )}
                                    </div>
                                    <Link href={dev.portfolio} className="group/link flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        Portfolio <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-24"
                >
                    <Button asChild variant="ghost" size="lg" className="rounded-full text-slate-400 hover:text-primary hover:bg-primary/5 px-10 h-12 text-base font-bold">
                        <Link href="/">
                            <Home className="h-5 w-5 mr-3" />
                            <span>Return Home</span>
                        </Link>
                    </Button>
                </motion.div>
            </main>
        </div>
    );
}
