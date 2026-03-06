"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Home,
  Gavel,
  UserCheck,
  ClipboardCheck,
  Cpu,
  Ban,
  Copyright,
  ShieldCheck,
  Scale,
  Power,
  Landmark,
  RefreshCcw,
  Zap,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";
import { useRef } from "react";

const termsSections = [
  {
    id: "acceptance",
    title: "Acceptance",
    summary: "Legally binding agreement upon entry.",
    icon: Gavel,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    gridClass: "md:col-span-2 lg:col-span-2",
    content: "By accessing Stride, you agree to be bound by these Terms. If you disagree, please stop using the platform immediately."
  },
  {
    id: "eligibility",
    title: "Eligibility",
    summary: "Strictly for users aged 18+.",
    icon: UserCheck,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    gridClass: "md:col-span-1 lg:col-span-1",
    content: "Stride services are only for individuals 18 and older. Using the platform confirms you meet this legal requirement."
  },
  {
    id: "responsibilities",
    title: "Your Part",
    summary: "Accurate data & secure access.",
    icon: ClipboardCheck,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    gridClass: "md:col-span-1 lg:col-span-1",
    content: "You must provide truthful data and keep your login credentials private at all times."
  },
  {
    id: "services",
    title: "Our Services",
    summary: "Banking sync & smart scheduling.",
    icon: Cpu,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    gridClass: "md:col-span-2 lg:col-span-2",
    content: "Stride provides automated appointment coordination and real-time bank branch synchronization."
  },
  {
    id: "prohibited",
    title: "No-Go Zone",
    summary: "No fraud, no abuse, no hacks.",
    icon: Ban,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    gridClass: "md:col-span-1 lg:col-span-1",
    content: "Fraudulent documents, system manipulation, and unauthorized access attempts are strictly prohibited."
  },
  {
    id: "intellectual",
    title: "The Brand",
    summary: "Stride IP is fully protected.",
    icon: Copyright,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    gridClass: "md:col-span-1 lg:col-span-1",
    content: "All code, logos, and technology are exclusive property. No unauthorized usage is permitted."
  },
  {
    id: "privacy",
    title: "Privacy First",
    summary: "Secure data handling protocols.",
    icon: ShieldCheck,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    gridClass: "md:col-span-1 lg:col-span-1",
    content: "Your data is managed under our Privacy Policy with industry-standard encryption."
  },
  {
    id: "liability",
    title: "Liabilities",
    summary: "Clear limits on platform risks.",
    icon: Scale,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    gridClass: "md:col-span-2 lg:col-span-2",
    content: "Stride is not liable for bank branch internal policies or unforeseen technical outages."
  },
  {
    id: "termination",
    title: "Termination",
    summary: "Right to close accounts for cause.",
    icon: Power,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    gridClass: "md:col-span-1 lg:col-span-1",
    content: "Stride reserves the right to terminate access for any violation of these terms."
  },
  {
    id: "governing",
    title: "Legal Rule",
    summary: "Governed by local jurisdiction.",
    icon: Landmark,
    color: "text-primary",
    bgColor: "bg-primary/10",
    gridClass: "md:col-span-1 lg:col-span-1",
    content: "These terms operate under the laws of Stride's primary operating jurisdiction."
  },
  {
    id: "updates",
    title: "Future Proof",
    summary: "Policy evolution & alerts.",
    icon: RefreshCcw,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    gridClass: "md:col-span-2 lg:col-span-2",
    content: "Continued use after policy updates constitutes acceptance. Stay tuned for official alerts."
  }
];

function BentoCard({ section, index }: { section: typeof termsSections[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  // Holographic Sheen Animation
  const sheenX = useSpring(useMotionValue(0));
  const sheenY = useSpring(useMotionValue(0));

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
    sheenX.set(mouseX);
    sheenY.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.08,
        duration: 0.8,
        type: "spring",
        bounce: 0.3
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className={`group relative ${section.gridClass} h-full transform-gpu`}
    >
      {/* Outer Glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-[2.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

      <div className="relative h-full flex flex-col p-8 rounded-[2.2rem] border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl shadow-2xl transition-all duration-500 group-hover:bg-white/80 dark:group-hover:bg-slate-900/60 overflow-hidden">

        {/* Holographic Sheen */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 mix-blend-overlay transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${sheenX}px ${sheenY}px, rgba(255,255,255,0.8) 0%, transparent 40%)`
          }}
        />

        {/* Floating Clause Number */}
        <span className="absolute -right-4 -bottom-4 text-9xl font-black text-slate-900/[0.03] dark:text-white/[0.03] select-none pointer-events-none transition-all group-hover:text-primary/[0.05] group-hover:scale-110 duration-700">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="flex items-start justify-between relative z-10 mb-8">
          <div className={`w-16 h-16 rounded-[1.25rem] ${section.bgColor} ${section.color} flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            <section.icon className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-end pt-2">
            <div className="flex gap-1 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary/30" />
              <div className="w-2 h-2 rounded-full bg-accent/30" />
              <div className="w-2 h-2 rounded-full bg-primary/10" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Clause {index + 1}</span>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{section.title}</h3>
            <p className={`text-[11px] font-bold uppercase tracking-widest ${section.color} opacity-80 pt-1`}>{section.summary}</p>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-[15px] group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors duration-500">
            {section.content}
          </p>
        </div>

        {/* Corner Decoration */}
        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-all duration-700 -rotate-12 translate-x-4 -translate-y-4">
          <section.icon className="w-20 h-20" />
        </div>
      </div>
    </motion.div>
  );
}

export default function TermsAndConditionsPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 py-24 md:py-32">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        <FloatingDoodles />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <main className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="text-center mb-20 md:mb-28"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-8 border border-primary/20 shadow-inner">
            <Lock className="w-4 h-4" />
            <span>Interactive Legal Framework</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-none drop-shadow-xl overflow-visible py-2">
            Terms of Service
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
            A next-gen, bento-style look at the rules that make <span className="text-primary font-black uppercase tracking-tighter">Stride</span> work for you.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
          {termsSections.map((section, index) => (
            <BentoCard key={section.id} section={section} index={index} />
          ))}
        </div>

        {/* Creative Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 w-full max-w-5xl rounded-[3rem] p-1 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"
        >
          <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[2.9rem] flex flex-col md:flex-row items-center gap-10 border border-white/20">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-white shadow-2xl animate-pulse">
                <Info className="w-10 h-10" />
              </div>
            </div>
            <div className="flex-grow text-center md:text-left">
              <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Need further clarity?</h4>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">Our legal team is ready to help you navigate Stride's frameworks. Reach out for a specialized consultation.</p>
            </div>
            <Button asChild size="lg" className="rounded-2xl px-12 h-16 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 group">
              <Link href="/contact" className="flex items-center gap-3">
                Connect <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-20"
        >
          <Button asChild variant="ghost" className="rounded-2xl text-slate-400 hover:text-primary hover:bg-primary/5 px-12 h-14 text-base font-black uppercase tracking-widest transition-all">
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
