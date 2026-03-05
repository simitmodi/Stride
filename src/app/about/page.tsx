"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  LayoutDashboard,
  Bell,
  FileCheck,
  CalendarRange,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import Logo from '@/lib/Logo.png';
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";
import { BackgroundWaves } from "@/components/landing/BackgroundWaves";

export default function AboutPage() {
  const pillars = [
    {
      title: "Elite Dashboards",
      description: "A personalized command center for your financial agenda.",
      Icon: LayoutDashboard,
      color: "bg-indigo-500/20 text-indigo-500",
      delay: 0.1,
    },
    {
      title: "Instant Intelligence",
      description: "Proactive notifications and live status updates.",
      Icon: Bell,
      color: "bg-blue-500/20 text-blue-500",
      delay: 0.2,
    },
    {
      title: "Document Mastery",
      description: "Precision guidance to ensure first-visit success.",
      Icon: FileCheck,
      color: "bg-emerald-500/20 text-emerald-500",
      delay: 0.3,
    },
    {
      title: "Calendar Synchronicity",
      description: "Seamless integration with your professional life.",
      Icon: CalendarRange,
      color: "bg-purple-500/20 text-purple-500",
      delay: 0.4,
    },
    {
      title: "Data-Driven Insight",
      description: "Intelligent time suggestions to eliminate the wait.",
      Icon: Lightbulb,
      color: "bg-amber-500/20 text-amber-500",
      delay: 0.5,
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <BackgroundWaves />
      <FloatingDoodles />

      <main className="relative z-10 w-full max-w-7xl px-4 md:px-8 py-20 flex flex-col items-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
            About Stride
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            Simplifying banking appointments with smarter scheduling and better preparation.
          </p>
        </motion.div>

        {/* Main Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full group"
        >
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 rounded-[2.5rem] blur-2xl opacity-50 pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-[2.5rem] border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[120px] shadow-2xl">

            {/* Left Column: The Narrative */}
            <div className="p-8 md:p-12 lg:border-r border-white/20 dark:border-white/10 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Image src={Logo} alt="Stride Logo" width={180} height={60} className="mb-10 brightness-0 dark:brightness-100 opacity-80" />

                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                  Architecture of Modern Banking.
                </h2>

                <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  <p>
                    Stride is an intelligent ecosystem architected to redefine the Indian banking experience.
                    By bridging the gap between legacy institutional processes and modern digital convenience,
                    we empower customers to navigate their financial lives with unprecedented clarity and speed.
                  </p>
                  <p>
                    By connecting users with banks digitally, Stride streamlines the workflow for both customers
                    and bank staff, making the entire process transparent, organized, and hassle-free.
                  </p>
                </div>

                <div className="mt-10">
                  <Button asChild className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
                    <Link href="/login">Get Started <ArrowRight className="w-4 h-4 ml-2" /></Link>
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Right Column: The Pillars */}
            <div className="p-8 md:p-12 bg-white/20 dark:bg-slate-900/40 flex flex-col justify-center gap-8">
              {pillars.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.delay + 0.5, duration: 0.6 }}
                  className="flex items-start gap-5 group/item"
                >
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shrink-0 border border-white/20 shadow-lg transition-transform group-hover/item:scale-110 drop-shadow-sm`}>
                    <item.Icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-normal">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </motion.div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16"
        >
          <Button asChild variant="ghost" size="lg" className="rounded-full text-slate-400 hover:text-primary hover:bg-primary/5">
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

// Stride: Professional Financial Connectivity
