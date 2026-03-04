"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from '@/lib/Logo.png';
import { ArrowRight, Globe, User, Headset, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HeroMockup } from "@/components/landing/HeroMockup";
import { BackgroundWaves } from "@/components/landing/BackgroundWaves";
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";

import { ProblemSection } from "@/components/landing/ProblemSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CtaSection } from "@/components/landing/SectionBlocks";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [realtimeData, setRealtimeData] = useState({
    date: 'tomorrow',
    slots: 12
  });

  useEffect(() => {
    setMounted(true);
    setRealtimeData({
      date: new Date(Date.now() + 86400000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      slots: 12
    });
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <BackgroundWaves />
      <FloatingDoodles />
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Image src={Logo} alt="Stride Logo" width={180} height={60} className="w-32 sm:w-auto h-auto sm:h-12" />
        </div>

        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-0 bg-secondary/50 dark:bg-slate-900/50 rounded-full p-1 backdrop-blur-sm">
          <Link href="/" className="px-5 py-2 rounded-full text-sm font-medium border border-transparent hover:border-indigo-400/30 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-sm transition-all duration-300 text-[#0F1729] dark:text-slate-100">Home</Link>
          <Link href="/about" className="px-5 py-2 rounded-full text-sm font-medium border border-transparent hover:border-indigo-400/30 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-sm transition-all duration-300 text-muted-foreground hover:text-[#0F1729] dark:hover:text-slate-100">About Us</Link>
          <Link href="/faq" className="px-5 py-2 rounded-full text-sm font-medium border border-transparent hover:border-indigo-400/30 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-sm transition-all duration-300 text-muted-foreground hover:text-[#0F1729] dark:hover:text-slate-100">FAQ</Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <LanguageSwitcher />
          <div id="google_translate_element" className="hidden"></div>

          <Link href="/login" className="text-sm font-medium hover:text-primary hidden md:block px-5 py-2.5 rounded-full border border-indigo-400/50 bg-white/50 backdrop-blur-sm shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-indigo-500/10 hover:border-indigo-400/80">Login</Link>
          <Button asChild size="sm" className="rounded-full px-4 sm:px-6 bg-primary hover:bg-primary/90 text-white shadow-gradient border border-indigo-400/50 hover:scale-105 active:scale-95 transition-all duration-300">
            <Link href="/signup/customer" className="text-xs sm:text-sm">Sign Up <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" /></Link>
          </Button>
        </div>
      </nav>

      {/* Hero Main Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center px-4">

        {/* Full-Screen Hero Text Area */}
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto min-h-[90vh] md:min-h-screen pt-20 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary dark:bg-slate-800 text-primary dark:text-primary text-sm font-medium mb-8">
            <User className="w-4 h-4" /> Next-Gen Banking is Here
          </div>

          <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-[#0F1729] dark:text-slate-50 leading-[1.1] mb-6 whitespace-pre-line px-2">
            Bank Smarter, <br className="hidden sm:block" /> Live Better.
          </h1>

          <p className="max-w-[500px] text-balance text-muted-foreground md:text-lg mb-10">
            Smart financial management with 24/7 AI-driven support, rapid branch booking, and advanced tools—all crafted to simplify your banking life.
          </p>

          <Button asChild size="lg" className="rounded-full h-14 px-8 text-base bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 hover:scale-105 transition-all duration-300">
            <Link href="/login">Get Started <ArrowRight className="w-5 h-5 ml-2" /></Link>
          </Button>
        </div>

        {/* 3D Tablet Dashboard Mockup */}
        <HeroMockup />

        {/* Feature Cards Grid (Resolved from conflicts) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl pb-32">

          {/* Card 1: Support Demo */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="h-full"
          >
            <div className="relative group hover:-translate-y-2 transition-transform duration-500 ease-out h-full flex">
              <div className="absolute -inset-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-[2.5rem] blur-2xl opacity-60 transition duration-500 group-hover:opacity-100" />
              <div className="relative w-full h-full bg-white dark:bg-black/90 rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 dark:border-slate-800 group-hover:border-[#4F46E5] group-hover:bg-[#F4F4F8] transition-colors duration-300 flex flex-col min-h-[300px]">

                <div className="mb-6">
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                    Available Now
                  </div>
                  <h3 className="text-5xl font-extrabold text-[#0F1729] dark:text-slate-100 tracking-tight">
                    <span>24/7</span>
                    <span className="text-2xl text-slate-400 font-medium tracking-normal ml-2"><span>Support</span></span>
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-full bg-[#4F46E5]/10 flex items-center justify-center mb-6 shrink-0">
                  <Headset className="w-6 h-6 text-[#4F46E5]" />
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-bold text-[#0F1729] dark:text-slate-100">Banking Assistance</h4>
                  <p className="text-sm font-medium text-slate-500 mt-1">Instant AI-powered assistance for all your banking needs</p>
                </div>

                <div className="mt-auto">
                  <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mb-6 relative"></div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-slate-500 mb-1"><span>Response Time</span></p>
                    <p className="font-semibold text-emerald-500"><span>{"< 1 min average"}</span></p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Card 2: Center Highlight (The blue one) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="h-full z-10"
          >
            <div className="relative group hover:-translate-y-2 transition-transform duration-500 ease-out h-full flex z-10">
              <div className="absolute -inset-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-[2.5rem] blur-2xl opacity-60 transition duration-500 group-hover:opacity-100" />
              <div className="relative w-full h-full bg-[#4F46E5] dark:bg-[#4F46E5] rounded-[2.5rem] p-8 shadow-sm border border-[#4F46E5] group-hover:border-[#F4F4F8] group-hover:bg-[#5c54eb] transition-colors duration-300 flex flex-col justify-between min-h-[300px] overflow-hidden">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium mb-8">
                    <Globe className="w-3 h-3" /> <span>User-Friendly Platform</span>
                  </div>
                  <h2 className="text-4xl font-bold text-white leading-tight mb-4"><span>Book. Manage. Connect.</span></h2>
                </div>

                <p className="text-white/80 font-medium leading-relaxed">
                  <span>Customers can easily schedule branch appointments to avoid waits, while bank staff efficiently juggle their availability and impending visits.</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Booking / Availability Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <div className="relative group hover:-translate-y-2 transition-transform duration-500 ease-out h-full flex">
              <div className="absolute -inset-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-[2.5rem] blur-2xl opacity-60 transition duration-500 group-hover:opacity-100" />
              <div className="relative w-full h-full bg-white dark:bg-black/90 rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 dark:border-slate-800 group-hover:border-[#4F46E5] group-hover:bg-[#F4F4F8] transition-colors duration-300 flex flex-col justify-between min-h-[300px]">

                <div className="flex justify-between items-start mb-6">
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                    <span>Instant Confirmation</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CalendarCheck className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-[#0F1729] dark:text-slate-100 mb-2"><span>Skip the Queue. Book Your Visit.</span></h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    <span>Select your branch, choose a preferred time, and receive confirmation in seconds.</span>
                  </p>
                </div>

                <div className="mt-auto">
                  <Button asChild className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400 group relative overflow-hidden h-12">
                    <Link href="/login">
                      <span className="relative z-10 font-bold">Reserve Your Slot</span>
                      <ArrowRight className="relative z-10 w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </main>

      <ProblemSection />
      <ProcessSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialSection />
      <CtaSection />
    </div>
  );
}
