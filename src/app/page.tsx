"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from '@/lib/Logo.png';
import { ArrowRight, Globe, ArrowDownUp, User } from "lucide-react";
import { landingTranslations, languages, LanguageCode } from "@/lib/landing-i18n";
import { motion } from "framer-motion";
import { useFirestore } from "@/firebase/provider";
import { collection, getCountFromServer, query, where, Timestamp } from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ProblemSection } from "@/components/landing/ProblemSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CtaSection } from "@/components/landing/SectionBlocks";

export default function Home() {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [mounted, setMounted] = useState(false);
  const [realtimeData, setRealtimeData] = useState({ date: "", slots: "19" });
  const [liveTrafficCount, setLiveTrafficCount] = useState<number>(24512);

  const firestore = useFirestore();

  useEffect(() => {
    setMounted(true);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toLocaleDateString(lang, { month: 'short', day: 'numeric' });

    setRealtimeData(prev => ({ ...prev, date: `${formattedDate}, 10:00 AM` }));

    // The Ticker - Increments numbers every 4 seconds to look 'Live'
    const interval = setInterval(() => {
      setLiveTrafficCount(prev => prev + Math.floor(Math.random() * 2) + 1);

      setRealtimeData(prev => {
        if (Math.random() > 0.8) {
          const currentSlots = parseInt(prev.slots);
          const change = Math.random() > 0.5 ? 1 : -1;
          const newSlots = Math.max(5, Math.min(45, currentSlots + change));
          return { ...prev, slots: newSlots.toString() };
        }
        return prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [lang]);

  const t = landingTranslations[lang];
  const selectedLangName = languages.find(l => l.code === lang)?.name || 'English';

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Image src={Logo} alt="Stride Logo" width={180} height={60} className="w-auto h-12" />
        </div>

        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-2 bg-secondary/50 dark:bg-slate-900/50 rounded-full p-1 backdrop-blur-sm">
          <Link href="/" className="px-5 py-2 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all text-[#0F1729] dark:text-slate-100">{t.home}</Link>
          <Link href="/about" className="px-5 py-2 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all text-muted-foreground hover:text-[#0F1729] dark:hover:text-slate-100">{t.aboutUs}</Link>
          <Link href="/faq" className="px-5 py-2 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all text-muted-foreground hover:text-[#0F1729] dark:hover:text-slate-100">{t.faq}</Link>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium cursor-pointer text-[#0F1729] dark:text-slate-100 hover:text-primary transition-colors">
                <Globe className="w-4 h-4" /> {selectedLangName}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              {languages.map((l) => (
                <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)} className="cursor-pointer">
                  {l.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">{t.login}</Link>
          <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Link href="/signup">{t.signup} <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </nav>

      {/* Hero Main Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center px-4">

        {/* Full-Screen Hero Text Area */}
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto min-h-[90vh] md:min-h-screen pt-20 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary dark:bg-slate-800 text-primary dark:text-primary text-sm font-medium mb-8">
            <User className="w-4 h-4" /> {t.heroTag}
          </div>

          <h1 className="text-balance text-6xl md:text-8xl font-bold tracking-tighter text-[#0F1729] dark:text-slate-50 leading-[1.1] mb-6 whitespace-pre-line">
            {t.heroTitle}
          </h1>

          <p className="max-w-[500px] text-balance text-muted-foreground md:text-lg mb-10">
            {t.heroSubtitle}
          </p>

          <Button asChild size="lg" className="rounded-full h-14 px-8 text-base bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 hover:scale-105 transition-all duration-300">
            <Link href="/login">{t.getStarted} <ArrowRight className="w-5 h-5 ml-2" /></Link>
          </Button>
        </div>

        {/* Feature Cards Grid (Scroll to reveal) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl pb-32">

          {/* Card 1: 24/7 Banking Support */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              },
              opacity: { duration: 0.7, delay: 0.1 }
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="h-full"
          >
            <div className="relative group hover:-translate-y-6 hover:scale-[1.02] transition-all duration-500 ease-out h-full flex">
              <div className="absolute -inset-2 bg-slate-200/40 dark:bg-slate-800/40 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-full h-full bg-white/70 dark:bg-black/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 dark:border-white/10 flex flex-col min-h-[340px] items-center text-center justify-between overflow-hidden">
                <div className="absolute top-6 left-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-subtle"></span> Always Online
                  </div>
                </div>

                <div className="mt-8 mb-4 relative">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-20" />
                  <Image
                    src="/images/headset_3d.png"
                    alt="24/7 Support"
                    width={140}
                    height={140}
                    className="relative z-10 w-32 h-32 object-contain"
                  />
                </div>

                <div className="mb-2">
                  <h4 className="text-xl font-bold text-[#0F1729] dark:text-slate-100">24/7 Banking Support</h4>
                  <p className="text-sm font-medium text-slate-500 mt-1">Expert assistance whenever you need it</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Center Hero - Bold Gradient */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              },
              opacity: { duration: 0.7, delay: 0.2 }
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="h-full z-10"
          >
            <div className="relative group hover:-translate-y-6 hover:scale-[1.02] transition-all duration-500 ease-out h-full flex z-10">
              <div className="absolute -inset-2 bg-primary/30 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-full h-full bg-[#4F46E5] rounded-[2.5rem] p-8 shadow-2xl border border-white/20 dark:border-white/10 flex flex-col justify-between min-h-[340px] overflow-hidden group">
                {/* Breathing light effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-breathing pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium mb-8">
                    <Globe className="w-3 h-3" /> {t.userFriendly}
                  </div>
                  <h2 className="text-5xl font-bold text-white leading-tight mb-4 tracking-tight drop-shadow-sm">{t.bookManage}</h2>
                </div>

                <p className="relative z-10 text-white/80 font-medium leading-relaxed max-w-[240px]">
                  {t.customerStaff}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Book Your Appointment */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              },
              opacity: { duration: 0.7, delay: 0.3 }
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="h-full"
          >
            <div className="relative group hover:-translate-y-6 hover:scale-[1.02] transition-all duration-500 ease-out h-full flex">
              <div className="absolute -inset-2 bg-slate-200/40 dark:bg-slate-800/40 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-full h-full bg-white/70 dark:bg-black/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 dark:border-white/10 flex flex-col items-center text-center justify-between min-h-[340px] overflow-hidden">
                <div className="mt-4 mb-2 relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 opacity-20" />
                  <Image
                    src="/images/calendar_3d.png"
                    alt="Book Appointment"
                    width={140}
                    height={140}
                    className="relative z-10 w-32 h-32 object-contain"
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#0F1729] dark:text-slate-100 mb-2">Book Your Appointment</h3>
                  <p className="text-slate-500 text-sm font-medium">Secure your slot with our advisors in seconds.</p>
                </div>

                <Button asChild className="group/btn rounded-full w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-200 h-12 transition-all duration-300">
                  <Link href="/login">
                    Schedule Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>


        </div>

      </main>

      <ProblemSection lang={lang} />
      <ProcessSection lang={lang} />
      <FeaturesSection lang={lang} />
      <StatsSection lang={lang} />
      <TestimonialSection lang={lang} />
      <CtaSection lang={lang} />
    </div>
  );
}
