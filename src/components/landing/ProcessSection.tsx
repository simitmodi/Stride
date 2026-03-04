"use client";

import { AnimateIn } from "./AnimateIn";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Smartphone, Bell, CreditCard, CheckCircle, ArrowRight, User } from "lucide-react";
import { useEffect } from "react";

export function ProcessSection() {

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  // Parallax Ratios
  const phoneX = useTransform(dx, [-500, 500], [-6, 6]);
  const phoneY = useTransform(dy, [-500, 500], [-6, 6]);
  const cardX = useTransform(dx, [-500, 500], [-3, 3]);
  const cardY = useTransform(dy, [-500, 500], [-3, 3]);
  const glowX = useTransform(dx, [-500, 500], [-1, 1]);
  const glowY = useTransform(dy, [-500, 500], [-1, 1]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const steps = [
    { number: "1", title: "Choose Bank & Service", delay: 100 },
    { number: "2", title: "View Required Documents", delay: 200 },
    { number: "3", title: "Book Appointment", delay: 300 },
  ];

  return (
    <section className="w-full py-32 bg-white relative overflow-hidden">
      {/* Premium Light Mesh Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle primary mesh layer for light mode */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_20%_35%,rgba(99,102,241,0.5)_0%,transparent_50%),radial-gradient(circle_at_80%_65%,rgba(99,102,241,0.3)_0%,transparent_50%)]" />

        {/* Moving ambient glows (softer for light mode) */}
        <motion.div
          style={{ x: glowX, y: glowY }}
          animate={{
            opacity: [0.3, 0.4, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-[120px]"
        />

        {/* Noise overlay for texture */}
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
        <div>
          <AnimateIn>
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-16 tracking-tight">
              How Stride Works
            </h2>
          </AnimateIn>

          <div className="space-y-14 relative">
            {/* Connecting line */}
            <div className="absolute left-[24px] top-6 bottom-10 w-px bg-slate-200 hidden md:block"></div>

            {steps.map((step, i) => (
              <AnimateIn key={i} delay={step.delay} className="relative flex items-center md:items-start gap-8 group">
                <div className="relative z-10 w-12 h-12 flex-shrink-0 bg-white rounded-xl flex items-center justify-center text-primary font-bold text-xl border border-slate-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-md shadow-slate-100">
                  {step.number}
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                    {step.title}
                  </h3>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>

        {/* 3D Floating SaaS Mockup Area */}
        <div className="relative flex justify-center items-center h-[700px] perspective-[2000px] w-full">
          <AnimateIn delay={400} className="relative w-full h-full flex items-center justify-center">

            {/* Soft Ambient Glow Pulse */}
            <motion.div
              animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ x: glowX, y: glowY }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"
            />

            <motion.div
              className="relative z-10 w-72 h-[580px] bg-slate-950 rounded-[3.5rem] border-[10px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col p-4 overflow-hidden"
              style={{
                rotateY: -1,
                rotateX: 1,
                x: phoneX,
                y: phoneY
              }}
              animate={{
                y: [0, -4, 0],
                rotateZ: [0, 0.5, 0],
                rotateX: [1, 1.5, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Light Sweep Reflection */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-30"
                animate={{ x: [-500, 500] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
              />

              {/* Internal Screen Content */}
              <div className="flex-1 rounded-[2.5rem] bg-[#020617] border border-white/5 p-6 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    Stride Pay
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em] mb-4">Select Date</p>
                    <div className="grid grid-cols-7 gap-2">
                      {[...Array(14)].map((_, i) => (
                        <div key={i} className={`h-5 rounded-md border border-white/5 transition-colors ${i === 4 ? 'bg-primary shadow-lg shadow-primary/30 border-primary' : 'bg-slate-800/50'}`} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em] mb-4">Available Slots</p>
                    <div className="space-y-3">
                      <div className="h-12 w-full bg-primary/5 border border-primary/40 rounded-2xl flex items-center px-4 justify-between shadow-inner">
                        <span className="text-xs text-white font-bold tracking-tight">10:30 AM</span>
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div className="h-12 w-full bg-slate-800/30 border border-white/5 rounded-2xl flex items-center px-4">
                        <span className="text-xs text-white/30 font-medium">11:15 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <div className="h-14 w-full bg-primary rounded-2xl flex items-center justify-center text-white text-xs font-bold gap-3 shadow-[0_10px_20px_-5px_rgba(var(--primary),0.5)] active:scale-95 transition-transform duration-300">
                    Reserve Slot <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Glass Inner Shine */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Floating Glass Cards */}
            <motion.div
              style={{ x: cardX, y: cardY }}
              className="absolute -left-16 top-1/4 z-20 w-60 p-5 rounded-3xl bg-white/80 backdrop-blur-2xl border border-indigo-400/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] flex items-center gap-4"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                <Bell className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Reminder</p>
                <p className="text-sm text-slate-900 font-bold">Tomorrow at 10:30 AM</p>
              </div>
            </motion.div>

            <motion.div
              style={{ x: cardX, y: cardY }}
              className="absolute -right-12 top-1/2 z-20 w-60 p-5 rounded-3xl bg-white/80 backdrop-blur-2xl border border-indigo-400/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] flex items-center gap-4"
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Success</p>
                <p className="text-sm text-slate-900 font-bold">Visit Confirmed</p>
              </div>
            </motion.div>

            <motion.div
              style={{ x: cardX, y: cardY }}
              className="absolute left-10 bottom-12 z-20 w-60 p-5 rounded-3xl bg-white/80 backdrop-blur-2xl border border-indigo-400/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] flex items-center gap-4"
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Fast Track</p>
                <p className="text-sm text-slate-900 font-bold">Priority Support</p>
              </div>
            </motion.div>

          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
