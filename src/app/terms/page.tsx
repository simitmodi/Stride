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
  ChevronRight,
  ArrowRight,
  Scale as ScaleIcon,
  Zap,
  Lock,
  Globe,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";
import { useState, useRef } from "react";

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
    title: "The No-Go Zone",
    summary: "No fraud, no abuse, no hacks.",
    icon: Ban,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    gridClass: "md:col-span-2 lg:col-span-1",
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
    gridClass: "md:col-span-1 lg:col-span-2",
    content: "These terms operate under the laws of Stride's primary operating jurisdiction."
  },
  {
    id: "updates",
    title: "Future Proof",
    summary: "We update terms periodically.",
    icon: RefreshCcw,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    gridClass: "md:col-span-2 lg:col-span-3",
    content: "Continued use after policy updates constitutes acceptance. Stay tuned for official alerts."
  }
];

function BentoCard({ section, index }: { section: typeof termsSections[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
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
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.8 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`group relative ${section.gridClass} h-full`}
    >
      <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

      <div className="relative h-full flex flex-col p-8 rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl shadow-xl transition-all duration-500 group-hover:bg-white/80 dark:group-hover:bg-slate-900/60 overflow-hidden"
        style={{ transform: "translateZ(50px)" }}>

        <div className="flex items-start justify-between mb-6">
          <div className={`w-14 h-14 rounded-2xl ${section.bgColor} ${section.color} flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            <section.icon className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 mb-1">Clause {index + 1}</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{section.title}</h3>
            <p className={`text-xs font-bold uppercase tracking-wider ${section.color} opacity-80`}>{section.summary}</p>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-sm">
            {section.content}
          </p>
        </div>

        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <section.icon className="w-24 h-24 -mr-8 -mt-8 rotate-12" />
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      </div>

      <main className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20">
            <Zap className="w-4 h-4" />
            <span>Interactive Legal Framework</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter drop-shadow-sm">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            A modern, bento-style look at the rules that make Stride work for you.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {termsSections.map((section, index) => (
            <BentoCard key={section.id} section={section} index={index} />
          ))}
        </div>

        {/* Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 w-full max-w-4xl p-6 rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-xl flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div className="flex-grow">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Still have questions?</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">For further clarification on our legal framework or privacy policies, please reach out to our support team.</p>
          </div>
          <Button asChild className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </motion.div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16"
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
