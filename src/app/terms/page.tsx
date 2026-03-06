"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Home,
  FileText,
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
  Scale as ScaleIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";
import { useState, useEffect } from "react";

const termsSections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: Gavel,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    content: [
      "Legal Agreement: By accessing Stride, you enter a binding legal agreement with our platform.",
      "Mandatory Compliance: Continued use of our services constitutes full acceptance of these terms.",
      "Discontinuation: If you disagree with any provision, you must immediately cease all platform usage."
    ]
  },
  {
    id: "eligibility",
    title: "Eligibility Criteria",
    icon: UserCheck,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    content: [
      "Age Requirement: Stride services are exclusively available to individuals aged 18 years and above.",
      "Representation: By utilizing our platform, you warrant that you meet all legal eligibility requirements.",
      "Jurisdictional Access: Access may be restricted based on regional banking regulations and compliance."
    ]
  },
  {
    id: "responsibilities",
    title: "User Responsibilities",
    icon: ClipboardCheck,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    content: [
      "Data Accuracy: Users must provide complete and truthful information during all registration phases.",
      "Lawful Usage: The platform must only be used for legitimate, bank-authorized appointment activities.",
      "Credential Security: You are solely responsible for maintaining the confidentiality of your account access."
    ]
  },
  {
    id: "services",
    title: "Platform Services",
    icon: Cpu,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    content: [
      "Appointment Coordination: Automated scheduling and synchronization with partner bank branches.",
      "Real-time Notifications: Dynamic reminders and status updates delivered via secure channels.",
      "Dashboard Utilities: Access to personalized tracking, history, and integrated calendar views.",
      "Service Availability: While we aim for 100% uptime, Stride does not guarantee uninterrupted access."
    ]
  },
  {
    id: "prohibited",
    title: "Prohibited Activities",
    icon: Ban,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    content: [
      "System Abuse: Manipulating, overloading, or attempting to compromise any platform infrastructure.",
      "Fraudulent Submission: Uploading false, misleading, or unauthorized banking documentation.",
      "Unauthorized Access: Any attempt to bypass security protocols or access another user's data.",
      "Disruptive Behavior: Interfering with the seamless experience of other Stride members."
    ]
  },
  {
    id: "intellectual",
    title: "Intellectual Property",
    icon: Copyright,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    content: [
      "Exclusive Ownership: All code, trademarks, designs, and logos are the property of Stride.",
      "Restricted Usage: Unauthorized replication or commercial use of our assets is strictly prohibited.",
      "Content Protection: Standard copyright laws protect all original content populated on the platform."
    ]
  },
  {
    id: "privacy",
    title: "Privacy & Data Security",
    icon: ShieldCheck,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    content: [
      "Data Protocols: Your information is handled in strict accordance with our official Privacy Policy.",
      "Security Standards: We implement industry-leading encryption and secure server architectures.",
      "Shared Responsibility: Users must take proactive steps to secure their personal hardware and access."
    ]
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    icon: Scale,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    content: [
      "Bank Operations: Stride is not liable for individual bank policies, cancellations, or delays.",
      "Technical Outages: No liability for losses incurred during maintenance or unforeseen outages.",
      "Security Breaches: Limitation of liability for unauthorized access resulting from user negligence.",
      "Legal Boundaries: Liability is strictly limited to the maximum extent permitted by governing law."
    ]
  },
  {
    id: "termination",
    title: "Termination of Service",
    icon: Power,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    content: [
      "Violation Protocols: Stride reserves the right to suspend accounts for any breach of these terms.",
      "Discretionary Closure: We may terminate services at our sole discretion to protect platform integrity.",
      "Data Retention: Post-termination data handling follows our standard privacy and compliance rules."
    ]
  },
  {
    id: "governing",
    title: "Governing Law",
    icon: Landmark,
    color: "text-primary",
    bgColor: "bg-primary/10",
    content: [
      "Jurisdiction: These terms are governed by the laws of the operating jurisdiction of Stride.",
      "Dispute Resolution: Formal resolution protocols apply as per local regulatory frameworks.",
      "Provision Validity: If any term is found invalid, the remaining provisions remain in full effect."
    ]
  },
  {
    id: "updates",
    title: "Future Revisions",
    icon: RefreshCcw,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    content: [
      "Policy Evolution: Stride may refine these terms periodically to reflect service improvements.",
      "Continued Usage: Continued platform access after updates constitutes acceptance of revised terms.",
      "Official Alerts: Significant changes will be broadcasted to users via primary system alerts."
    ]
  }
];

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState("acceptance");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    termsSections.forEach(section => {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold mb-6 border border-emerald-500/20">
            <ScaleIcon className="w-4 h-4" />
            <span>Legal Compliance & Terms</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter drop-shadow-sm">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            The comprehensive legal framework governing your Stride banking experience.
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
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 px-3">Quick Navigation</h3>
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {termsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 mb-1 ${activeSection === section.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20 translate-x-1"
                      : "hover:bg-primary/5 text-slate-600 dark:text-slate-400"}`}
                  >
                    <section.icon className={`w-5 h-5 transition-transform duration-300 ${activeSection === section.id ? "scale-110" : "group-hover:scale-110"}`} />
                    <span className="font-bold flex-grow text-left text-sm">{section.title}</span>
                    {activeSection === section.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </aside>

          {/* Right: Main Content Panel */}
          <div className="lg:col-span-8 space-y-12 order-1 lg:order-2">
            {termsSections.map((section, index) => (
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

      <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.3);
                }
            `}</style>
    </div>
  );
}
