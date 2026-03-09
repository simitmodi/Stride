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
import { developersData } from "@/lib/developers";

const developers = Object.values(developersData);

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
                    initial={{ opacity: 0, y: -20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                                delay: index * 0.1 
                            }}
                            className="group relative h-full"
                        >
                            {/* Outer Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

                            <div className="relative h-full flex flex-col p-8 rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl shadow-2xl transition-all duration-500 group-hover:bg-white/70 dark:group-hover:bg-slate-900/60 overflow-hidden">

                                {/* Header: Icon & Name */}
                                <div className="flex items-center gap-5 mb-6">
                                    <div className={`w-14 h-14 rounded-2xl ${dev.brandColor.split(' ')[0].replace('from-', 'bg-')}/20 ${dev.brandColor.split(' ')[0].replace('from-', 'text-')} flex items-center justify-center border border-white/20 shadow-lg transition-transform group-hover:scale-110 duration-500`}>
                                        {(() => {
                                            const Icon = dev.icon;
                                            return <Icon className="w-7 h-7" strokeWidth={1.5} />;
                                        })()}
                                    </div>
                                    <div>
                                        <Link href={`/developers/${dev.slug}`}>
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight hover:text-primary transition-colors cursor-pointer">{dev.name}</h3>
                                        </Link>
                                        <span className="text-sm font-semibold text-primary/80 uppercase tracking-widest">{dev.role}</span>
                                    </div>
                                </div>

                                {/* Short Summary */}
                                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8 flex-grow">
                                    {dev.summary}
                                </p>

                                {/* Social Links */}
                                <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-white/5">
                                    <div className="flex gap-4">
                                        {dev.contact.github && dev.contact.github !== "#" && (
                                            <Link href={dev.contact.github} className="p-2 rounded-full hover:bg-primary/10 text-slate-400 hover:text-primary transition-all">
                                                <Github className="w-5 h-5" />
                                            </Link>
                                        )}
                                        {dev.contact.linkedin && dev.contact.linkedin !== "#" && (
                                            <Link href={dev.contact.linkedin} className="p-2 rounded-full hover:bg-primary/10 text-slate-400 hover:text-primary transition-all">
                                                <Linkedin className="w-5 h-5" />
                                            </Link>
                                        )}
                                        {dev.contact.portfolio && dev.contact.portfolio !== "#" && (
                                            <Link href={dev.contact.portfolio} className="p-2 rounded-full hover:bg-primary/10 text-slate-400 hover:text-primary transition-all">
                                                <Globe className="w-5 h-5" />
                                            </Link>
                                        )}
                                        {dev.contact.instagram && (
                                            <Link href={dev.contact.instagram} className="p-2 rounded-full hover:bg-primary/10 text-slate-400 hover:text-primary transition-all">
                                                <Instagram className="w-5 h-5" />
                                            </Link>
                                        )}
                                    </div>
                                    <Link href={`/developers/${dev.slug}`} className="group/link flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        View Profile <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
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
