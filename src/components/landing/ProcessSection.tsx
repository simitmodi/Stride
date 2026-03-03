"use client";

import { AnimateIn } from "./AnimateIn";
import { landingTranslations, LanguageCode } from "@/lib/landing-i18n";
import { motion } from "framer-motion";
import { Smartphone, Bell, CreditCard, CheckCircle, ArrowRight, User } from "lucide-react";

export function ProcessSection({ lang }: { lang: LanguageCode }) {
  const t = landingTranslations[lang];
  const steps = [
    {
      number: "1",
      title: t.proc1Title,
      delay: 100,
    },
    {
      number: "2",
      title: t.proc2Title,
      delay: 200,
    },
    {
      number: "3",
      title: t.proc3Title,
      delay: 300,
    },
  ];

  return (
    <section className="w-full py-24 bg-white dark:bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <AnimateIn>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-16">
              {t.procTitle}
            </h2>
          </AnimateIn>

          <div className="space-y-12 relative">
            {/* Connecting line */}
            <div className="absolute left-[24px] top-6 bottom-10 w-0.5 bg-slate-100 dark:bg-slate-800 hidden md:block"></div>

            {steps.map((step, i) => (
              <AnimateIn key={i} delay={step.delay} className="relative flex items-center md:items-start gap-6 group">
                {/* Number Badge */}
                <div className="relative z-10 w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl border-2 border-white dark:border-background lg:group-hover:bg-primary lg:group-hover:text-white transition-colors duration-300">
                  {step.number}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {step.title}
                  </h3>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>

        {/* 3D Floating SaaS Mockup Area */}
        <div className="relative flex justify-center items-center h-[600px] perspective-[1000px] w-full max-w-[500px] lg:max-w-none mx-auto">
          <AnimateIn delay={400} className="relative w-full h-full flex items-center justify-center">
            {/* Ambient Background Glows & Stage */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-slate-900/5 dark:bg-primary/5 rounded-[3rem] blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 dark:bg-primary/30 rounded-full blur-[100px] opacity-40 shrink-0" />
            <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-[80px] opacity-30 shrink-0" />

            <motion.div
              className="relative z-10 w-64 h-[500px] bg-slate-950 rounded-[3rem] border-8 border-slate-800 shadow-2xl flex flex-col p-4 overflow-hidden"
              style={{ rotateY: -15, rotateX: 10 }}
              animate={{
                y: [0, -15, 0],
                rotateY: [-15, -10, -15],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Internal Screen Content */}
              <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800/50 p-4 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="px-2 py-1 rounded bg-slate-800 border border-white/5 text-[8px] text-slate-400 font-medium uppercase tracking-tighter">
                    Stride Mobile
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Select Date</p>
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(14)].map((_, i) => (
                        <div key={i} className={`h-4 rounded-sm border border-white/5 ${i === 4 ? 'bg-primary' : 'bg-slate-800/40'}`} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Available Slots</p>
                    <div className="space-y-2">
                      <div className="h-8 w-full bg-primary/10 border border-primary/30 rounded-lg flex items-center px-3 justify-between">
                        <span className="text-[10px] text-white font-bold">10:30 AM</span>
                        <CheckCircle className="w-3 h-3 text-primary" />
                      </div>
                      <div className="h-8 w-full bg-slate-800/40 border border-white/5 rounded-lg flex items-center px-3">
                        <span className="text-[10px] text-white/40">11:15 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <div className="h-10 w-full bg-primary rounded-xl flex items-center justify-center text-white text-[10px] font-bold gap-2 shadow-lg shadow-primary/20">
                    Reserve Slot <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Glass Top Overlay for Shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            </motion.div>

            {/* Floating Glass Cards */}
            <motion.div
              className="absolute -left-12 top-1/4 z-20 w-52 p-4 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 shadow-2xl flex items-center gap-3"
              animate={{
                y: [-10, 10, -10],
                x: [-5, 5, -5]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 dark:text-white/50 uppercase font-bold tracking-wider">Reminder</p>
                <p className="text-xs text-slate-900 dark:text-white font-bold">Tomorrow at 10:30 AM</p>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-8 top-1/2 z-20 w-52 p-4 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 shadow-2xl flex items-center gap-3"
              animate={{
                y: [10, -10, 10],
                x: [5, -5, 5]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 dark:text-white/50 uppercase font-bold tracking-wider">Success</p>
                <p className="text-xs text-slate-900 dark:text-white font-bold">Visit Confirmed</p>
              </div>
            </motion.div>

            <motion.div
              className="absolute left-8 bottom-12 z-20 w-52 p-4 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 shadow-2xl flex items-center gap-3"
              animate={{
                y: [-5, 5, -5],
                x: [8, -8, 8]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 dark:text-white/50 uppercase font-bold tracking-wider">Fast Track</p>
                <p className="text-xs text-slate-900 dark:text-white font-bold">Priority Support</p>
              </div>
            </motion.div>

          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
