"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Home,
  FileText,
  Database,
  Settings,
  Share2,
  ShieldCheck,
  UserCircle,
  Fingerprint,
  AlertCircle,
  RefreshCcw,
  Mail,
  ArrowRight,
  ChevronRight,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";
import { useState, useEffect } from "react";

const privacySections = [
  {
    id: "collection",
    title: "Information We Collect",
    icon: Database,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    content: [
      "Personal Identifiers: Full name, verified email, and contact details for account management.",
      "Financial Context: Banking branch preferences and appointment-related documentation.",
      "Technical Footprint: Device metadata, IP address, and platform interaction logs for security."
    ]
  },
  {
    id: "usage",
    title: "How We Use Information",
    icon: Settings,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    content: [
      "Operational Excellence: Managing and optimizing your banking appointment schedule.",
      "Proactive Communication: Automated reminders, updates, and critical system notifications.",
      "Security & Compliance: Ensuring adherence to financial regulations and platform safeguards."
    ]
  },
  {
    id: "sharing",
    title: "Data Sharing Protocols",
    icon: Share2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    content: [
      "Partner Integration: Information is shared strictly with your selected partner banks for verification.",
      "Zero Third-Party Sales: Stride maintains a zero-tolerance policy for selling or renting user data.",
      "Legal Mandates: Data disclosure only occurs when required by enforceable legal or regulatory requests."
    ]
  },
  {
    id: "security",
    title: "Security Infrastructure",
    icon: ShieldCheck,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    content: [
      "Advanced Encryption: Multi-layered encryption protocols for data at rest and in transit.",
      "Access Control: Integrated authentication safeguards and secure server architecture.",
      "Discretionary Sharing: While we maintain elite security, users share information at their own discretion."
    ]
  },
  {
    id: "rights",
    title: "User Rights & Control",
    icon: UserCircle,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    content: [
      "Data Autonomy: Access and update your personal profiles directly through the secure dashboard.",
      "Account Deletions: Formal request system for full account and data removal.",
      "Preference Management: Comprehensive opt-out systems for all non-essential notifications."
    ]
  },
  {
    id: "cookies",
    title: "Cookies & Analytics",
    icon: Fingerprint,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    content: [
      "Platform Optimization: Utilizing cookies to enhance performance and analyze user behavior.",
      "Technical Integrity: Managing session states and ensuring persistent security configurations."
    ]
  },
  {
    id: "minor",
    title: "Children's Privacy",
    icon: AlertCircle,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    content: [
      "Age Restrictions: Stride is designed exclusively for users aged 18 and above.",
      "Minor Protection: We do not knowingly collect or process data from individuals under age."
    ]
  },
  {
    id: "changes",
    title: "Policy Updates",
    icon: RefreshCcw,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    content: [
      "Periodic Revisions: Stride may update this policy to reflect new features or regulations.",
      "Material Notifications: Users will be alerted to significant changes via primary contact methods."
    ]
  },
  {
    id: "contact",
    title: "Contact & Feedback",
    icon: Mail,
    color: "text-primary",
    bgColor: "bg-primary/10",
    content: [
      "Direct Support: For all privacy-related inquiries, please utilize our dedicated contact systems.",
      "Formal Feedback: We welcome insights on how to further protect your financial data."
    ]
  }
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("collection");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    privacySections.forEach(section => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 py-24 md:py-32">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        <FloatingDoodles />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
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
            <Lock className="w-4 h-4" />
            <span>Security & Privacy First</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter drop-shadow-sm">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            How Stride handles your data with extreme precision and security.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full mt-12 items-start">
          {/* Left: Sticky Table of Contents */}
          <aside className="lg:col-span-4 sticky top-32 order-2 lg:order-1 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="p-8 rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl shadow-xl space-y-2"
            >
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 px-3">Sections</h3>
              {privacySections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${activeSection === section.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20 translate-x-1"
                    : "hover:bg-primary/5 text-slate-600 dark:text-slate-400"}`}
                >
                  <section.icon className={`w-5 h-5 transition-transform duration-300 ${activeSection === section.id ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="font-bold flex-grow text-left">{section.title}</span>
                  {activeSection === section.id && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </motion.div>
          </aside>

          {/* Right: Main Content Panel */}
          <div className="lg:col-span-8 space-y-12 order-1 lg:order-2">
            {privacySections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative group"
              >
                {/* Active Indicator Glow (Mobile) */}
                <div className={`absolute -inset-1 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-[2.5rem] blur-xl transition-opacity duration-700 ${activeSection === section.id ? "opacity-100" : "opacity-0"}`} />

                <div className="relative p-8 md:p-12 rounded-[2.5rem] border border-white/50 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-[80px] shadow-2xl overflow-hidden transition-all duration-500 group-hover:border-primary/20">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Icon Section */}
                    <div className={`shrink-0 w-20 h-20 rounded-3xl ${section.bgColor} ${section.color} flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                      <section.icon className="w-10 h-10" strokeWidth={1.5} />
                    </div>

                    {/* Text Section */}
                    <div className="space-y-6">
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{section.title}</h2>
                      <div className="space-y-4">
                        {section.content.map((point, pIndex) => (
                          <div key={pIndex} className="flex gap-4 group/point">
                            <div className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/point:bg-primary transition-colors" />
                            <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                              {point}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.section>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-24"
        >
          <Button asChild variant="outline" size="lg" className="rounded-full text-slate-400 hover:text-primary hover:bg-primary/5 px-10 h-12 text-base font-bold">
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
