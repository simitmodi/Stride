"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShieldCheck, Zap, Globe, Users, TrendingUp, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// --- Magnetic Card Component ---
const BentoCard = ({
    children,
    className = "",
    delay = 0,
    gradient = "from-indigo-500/10 via-transparent to-transparent"
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    gradient?: string;
}) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className={`relative group ${className}`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div
                style={{ transform: "translateZ(50px)" }}
                className="relative h-full w-full rounded-[2rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-indigo-400/20 group-hover:border-indigo-400/50 transition-colors duration-500 p-8 flex flex-col overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                {children}
            </div>
        </motion.div>
    );
};

export function AboutSection() {
    const [count, setCount] = useState(12800);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 3));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="w-full py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-400/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            Our Philosophy
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]"
                        >
                            Redefining the <span className="text-primary italic">Pulse</span> of Modern Banking.
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="max-w-md text-slate-500 dark:text-slate-400 font-medium leading-relaxed"
                    >
                        Stride isn&apos;t just a booking tool. It&apos;s a sophisticated financial layer designed for speed, security, and human-centric local interaction.
                    </motion.p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[650px]">

                    {/* 1. Large Vision Card */}
                    <BentoCard className="md:col-span-7 md:row-span-2" delay={0.1}>
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-400/20 mb-8">
                                    <Globe className="w-6 h-6 text-indigo-500" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Born in India, <br />Built for the World.</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-md">
                                    We started with a simple mission: to make every banking visit as efficient as an instant payment. Today, Stride powers seamless connections at scale.
                                </p>
                            </div>
                            <div className="mt-12 flex items-center gap-6">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                        +2k
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-slate-400 italic">Trusted by thousands of customers nationwide.</p>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 2. Security Card */}
                    <BentoCard className="md:col-span-5 md:row-span-1" delay={0.2} gradient="from-rose-500/10">
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-400/20 shrink-0">
                                <ShieldCheck className="w-8 h-8 text-rose-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Banking-Grade Trust</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                    Your data is encrypted with military-grade standards. We prioritize security so you can focus on your finances.
                                </p>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 3. Scale Card */}
                    <BentoCard className="md:col-span-5 md:row-span-1" delay={0.3} gradient="from-emerald-500/10">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Live Impact</p>
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <span className="text-5xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                                    {count.toLocaleString()}
                                </span>
                                <p className="text-sm font-bold text-slate-400 mt-1">Appointments Handled This Month</p>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 4. Experience Card (Bottom Span) */}
                    <BentoCard className="md:col-span-12 md:row-span-1" delay={0.4} gradient="from-primary/10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Seamless Experience</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Crafted with precision for a frictionless digital-to-physical transition.</p>
                                </div>
                            </div>
                            <Button className="rounded-full px-8 h-12 bg-slate-900 dark:bg-white dark:text-slate-950 hover:scale-105 transition-all duration-300">
                                Join the Future <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </BentoCard>
                </div>
            </div>
        </section>
    );
}

const Button = ({ children, className = "", ...props }: any) => (
    <button
        className={`inline-flex items-center justify-center font-bold text-sm transition-all focus:outline-none ${className}`}
        {...props}
    >
        {children}
    </button>
);
