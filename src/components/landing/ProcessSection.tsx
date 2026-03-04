"use client";

import { AnimateIn } from "./AnimateIn";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  Smartphone, Bell, CreditCard, CheckCircle, ArrowRight, User,
  Building2, Search, FileText, FileCheck, Upload, Calendar, Clock, MapPin
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const STEP_DURATION = 4000; // ms per step

  // Smooth progress animation + auto-cycle
  useEffect(() => {
    startTimeRef.current = Date.now();
    setProgress(0);

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(elapsed / STEP_DURATION, 1);
      setProgress(pct);

      if (pct >= 1) {
        setActiveStep((prev) => (prev + 1) % 3);
        return; // new activeStep triggers a new useEffect run
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [activeStep]);

  const handleStepClick = useCallback((i: number) => {
    setActiveStep(i);
    // reset will happen via useEffect
  }, []);

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

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
    { number: "1", title: "Choose Bank & Service", delay: 100, description: "Browse nearby branches, compare wait times, and pick the exact service you need." },
    { number: "2", title: "View Required Documents", delay: 200, description: "Get a personalized checklist so you never show up missing a form or ID again." },
    { number: "3", title: "Book Appointment", delay: 300, description: "Reserve your slot in seconds, get a calendar invite, and skip the queue entirely." },
  ];

  // Floating card content synced to active step
  const floatingCards = [
    { icon: Building2, label: "Selected", text: "Bank of Baroda — Navrangpura", color: "blue" },
    { icon: FileCheck, label: "Ready", text: "3/3 Documents Verified", color: "emerald" },
    { icon: Calendar, label: "Booked", text: "Tomorrow, 10:30 AM", color: "primary" },
  ];

  const activeCard = floatingCards[activeStep];

  return (
    <section className="w-full py-32 bg-white relative overflow-hidden">
      {/* Premium Light Mesh Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_20%_35%,rgba(99,102,241,0.5)_0%,transparent_50%),radial-gradient(circle_at_80%_65%,rgba(99,102,241,0.3)_0%,transparent_50%)]" />
        <motion.div
          style={{ x: glowX, y: glowY }}
          animate={{ opacity: [0.3, 0.4, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">

        {/* Left side — Steps */}
        <div>
          <AnimateIn>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 mb-8 sm:mb-16 tracking-tight text-center lg:text-left">
              How Stride Works
            </h2>
          </AnimateIn>

          <div className="space-y-6 sm:space-y-10 relative">
            {/* Connecting line (background track) — stops at last step circle */}
            <div className="absolute left-[19px] sm:left-[23px] top-6 bottom-[50px] w-px bg-slate-200 hidden md:block" />

            {/* Active progress fill — smooth continuous animation */}
            <div
              className="absolute left-[19px] sm:left-[23px] top-6 w-px bg-primary hidden md:block origin-top"
              style={{
                height: `${((activeStep + progress) / 3) * 100}%`,
                maxHeight: 'calc(100% - 50px)',
              }}
            />

            {steps.map((step, i) => (
              <div
                key={i}
                className={`relative flex items-start gap-4 sm:gap-8 cursor-pointer transition-all duration-500 ${activeStep === i ? '' : 'opacity-40'}`}
                onClick={() => handleStepClick(i)}
              >
                <motion.div
                  className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl border transition-all duration-500 shadow-md ${
                    activeStep === i
                      ? 'bg-primary text-white border-primary shadow-primary/30 scale-110'
                      : 'bg-white text-primary border-slate-200 shadow-slate-100'
                  }`}
                  layout
                >
                  {step.number}
                </motion.div>
                <div className="pt-1 sm:pt-2">
                  <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold transition-colors duration-300 ${activeStep === i ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </h3>
                  <AnimatePresence mode="wait">
                    {activeStep === i && (
                      <motion.p
                        key={`desc-${i}`}
                        initial={{ opacity: 0, height: 0, y: -5 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm sm:text-base text-slate-500 mt-2 max-w-sm leading-relaxed"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          {/* Step indicator dots */}
          <div className="flex items-center gap-2 mt-8 sm:mt-12 justify-center lg:justify-start">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => handleStepClick(i)}
                className={`rounded-full transition-all duration-300 overflow-hidden relative ${activeStep === i ? 'w-10 h-2.5 bg-slate-200' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'}`}
              >
                {activeStep === i && (
                  <div
                    className="absolute inset-0 bg-primary rounded-full origin-left"
                    style={{ width: `${progress * 100}%`, transition: 'width 0.05s linear' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right side — Dynamic Phone Mockup */}
        <div className="relative flex justify-center items-center h-[400px] sm:h-[500px] lg:h-[700px] perspective-[2000px] w-full scale-[0.85] sm:scale-100">
          <AnimateIn delay={400} className="relative w-full h-full flex items-center justify-center">

            {/* Soft Ambient Glow Pulse */}
            <motion.div
              animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ x: glowX, y: glowY }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"
            />

            {/* Phone Frame */}
            <motion.div
              className="relative z-10 w-72 h-[580px] bg-slate-950 rounded-[3.5rem] border-[10px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col p-4 overflow-hidden"
              style={{ rotateY: -1, rotateX: 1, x: phoneX, y: phoneY }}
              animate={{ y: [0, -4, 0], rotateZ: [0, 0.5, 0], rotateX: [1, 1.5, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Light Sweep Reflection */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-30"
                animate={{ x: [-500, 500] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
              />

              {/* Internal Screen Content — Swaps per step */}
              <div className="flex-1 rounded-[2.5rem] bg-[#020617] border border-white/5 p-6 flex flex-col relative overflow-hidden">
                {/* Header (static) */}
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    Stride
                  </div>
                </div>

                {/* Animated Screen Content */}
                <AnimatePresence mode="wait">
                  {activeStep === 0 && <ScreenChooseBank key="screen-0" />}
                  {activeStep === 1 && <ScreenDocuments key="screen-1" />}
                  {activeStep === 2 && <ScreenBooking key="screen-2" />}
                </AnimatePresence>

                {/* Glass Inner Shine */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Context-aware floating card that changes per step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`float-${activeStep}`}
                initial={{ opacity: 0, x: 30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1, y: [0, -6, 0] }}
                exit={{ opacity: 0, x: -30, scale: 0.9 }}
                transition={{ duration: 0.5, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                style={{ x: cardX, y: cardY }}
                className="absolute -right-10 sm:-right-16 top-1/4 z-20 w-52 sm:w-64 p-4 sm:p-5 rounded-3xl bg-white/80 backdrop-blur-2xl border border-indigo-400/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] items-center gap-4 pointer-events-auto hidden lg:flex"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  activeStep === 0 ? 'bg-blue-50 border-blue-100' :
                  activeStep === 1 ? 'bg-emerald-50 border-emerald-100' :
                  'bg-indigo-50 border-indigo-100'
                }`}>
                  <activeCard.icon className={`w-6 h-6 ${
                    activeStep === 0 ? 'text-blue-500' :
                    activeStep === 1 ? 'text-emerald-500' :
                    'text-indigo-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">{activeCard.label}</p>
                  <p className="text-sm text-slate-900 font-bold">{activeCard.text}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}

/* ───── Screen Components ───── */

const screenTransition = {
  initial: { opacity: 0, y: 20, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -20, filter: "blur(4px)" },
  transition: { duration: 0.4 },
};

function ScreenChooseBank() {
  return (
    <motion.div className="flex-1 flex flex-col space-y-6" {...screenTransition}>
      <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em]">Select Bank</p>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <div className="h-10 w-full bg-slate-800/50 border border-white/5 rounded-2xl pl-9 flex items-center">
          <span className="text-xs text-white/30">Search banks...</span>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { name: "Bank of Baroda", branch: "Navrangpura, Ahmedabad", active: true },
          { name: "SBI", branch: "CG Road, Ahmedabad", active: false },
          { name: "HDFC Bank", branch: "Satellite, Ahmedabad", active: false },
        ].map((bank, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 + 0.2 }}
            className={`h-14 w-full rounded-2xl flex items-center px-4 gap-3 transition-all ${
              bank.active
                ? 'bg-primary/10 border border-primary/40 shadow-inner'
                : 'bg-slate-800/30 border border-white/5'
            }`}
          >
            <Building2 className={`w-4 h-4 ${bank.active ? 'text-primary' : 'text-white/20'}`} />
            <div className="flex-1">
              <p className={`text-xs font-bold ${bank.active ? 'text-white' : 'text-white/40'}`}>{bank.name}</p>
              <p className="text-[10px] text-white/20">{bank.branch}</p>
            </div>
            {bank.active && <CheckCircle className="w-4 h-4 text-primary" />}
          </motion.div>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em] mb-3">Service</p>
        <div className="h-12 w-full bg-primary/5 border border-primary/40 rounded-2xl flex items-center px-4 justify-between shadow-inner">
          <span className="text-xs text-white font-bold">Account Opening</span>
          <ArrowRight className="w-4 h-4 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}

function ScreenDocuments() {
  const docs = [
    { name: "Aadhar Card", status: "verified" },
    { name: "PAN Card", status: "verified" },
    { name: "Passport Photo", status: "pending" },
    { name: "Address Proof", status: "verified" },
  ];

  return (
    <motion.div className="flex-1 flex flex-col space-y-5" {...screenTransition}>
      <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em]">Required Documents</p>

      <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
        <FileCheck className="w-4 h-4 text-emerald-400" />
        <p className="text-[11px] text-emerald-400 font-bold">3 of 4 documents verified</p>
      </div>

      <div className="space-y-3">
        {docs.map((doc, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.15 }}
            className="h-13 w-full bg-slate-800/30 border border-white/5 rounded-2xl flex items-center px-4 py-3 gap-3"
          >
            <FileText className="w-4 h-4 text-white/30" />
            <span className="text-xs text-white/60 font-medium flex-1">{doc.name}</span>
            {doc.status === "verified" ? (
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-bold">Ready</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] text-amber-400 font-bold">Report Missing</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <div className="h-14 w-full bg-primary rounded-2xl flex items-center justify-center text-white text-xs font-bold gap-3 shadow-[0_10px_20px_-5px_rgba(var(--primary),0.5)]">
          Done <Upload className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

function ScreenBooking() {
  return (
    <motion.div className="flex-1 flex flex-col space-y-6" {...screenTransition}>
      <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em]">Select Date</p>
      <div className="grid grid-cols-7 gap-2">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 + 0.15 }}
            className={`h-5 rounded-md border border-white/5 transition-colors ${i === 4 ? 'bg-primary shadow-lg shadow-primary/30 border-primary' : 'bg-slate-800/50'}`}
          />
        ))}
      </div>

      <div>
        <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em] mb-4">Available Slots</p>
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="h-12 w-full bg-primary/5 border border-primary/40 rounded-2xl flex items-center px-4 justify-between shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-white font-bold tracking-tight">10:30 AM</span>
            </div>
            <CheckCircle className="w-4 h-4 text-primary" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="h-12 w-full bg-slate-800/30 border border-white/5 rounded-2xl flex items-center px-4 gap-2"
          >
            <Clock className="w-3.5 h-3.5 text-white/20" />
            <span className="text-xs text-white/30 font-medium">11:15 AM</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="h-12 w-full bg-slate-800/30 border border-white/5 rounded-2xl flex items-center px-4 gap-2"
          >
            <Clock className="w-3.5 h-3.5 text-white/20" />
            <span className="text-xs text-white/30 font-medium">2:00 PM</span>
          </motion.div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <div className="h-14 w-full bg-primary rounded-2xl flex items-center justify-center text-white text-xs font-bold gap-3 shadow-[0_10px_20px_-5px_rgba(var(--primary),0.5)]">
          Confirm Booking <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}
