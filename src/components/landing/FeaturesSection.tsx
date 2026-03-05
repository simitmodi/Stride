"use client";

import { AnimateIn } from "./AnimateIn";
import { Clock, FileCheck, MapPin, BellRing, LayoutDashboard, Users } from "lucide-react";
export function FeaturesSection() {
  const features = [
    {
      icon: <Clock className="w-5 h-5 text-primary" />,
      title: "Real-time Slot Availability",
      description: "Instantly view and book open times without waiting on hold.",
      delay: 100,
    },
    {
      icon: <FileCheck className="w-5 h-5 text-primary" />,
      title: "Document Clarity System",
      description: "Know exactly what forms to bring before you ever step foot in the bank.",
      delay: 150,
    },
    {
      icon: <MapPin className="w-5 h-5 text-primary" />,
      title: "Multi-Branch Support",
      description: "Find availability across all nearby branches in one unified view.",
      delay: 200,
    },
    {
      icon: <BellRing className="w-5 h-5 text-primary" />,
      title: "Smart Notifications",
      description: "Get updates via SMS and email if better times open up.",
      delay: 250,
    },
    {
      icon: <LayoutDashboard className="w-5 h-5 text-primary" />,
      title: "Appointment Dashboard",
      description: "Manage, reschedule, or cancel previous and upcoming visits easily.",
      delay: 300,
    },
    {
      icon: <Users className="w-5 h-5 text-primary" />,
      title: "Bank Staff Integration",
      description: "Tools for tellers and managers to handle walk-ins and appointments seamlessly.",
      delay: 350,
    },
  ];

  return (
    <section className="w-full py-24 bg-[#F4F4F8] dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <AnimateIn>
          <div className="text-center lg:text-left mb-16 px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 italic">
              Built for First-Visit Success
            </h2>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <AnimateIn key={i} delay={feat.delay} className="group relative hover:-translate-y-2 transition-transform duration-500 ease-out h-full flex">
              <div className="absolute -inset-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl blur-xl opacity-60 transition duration-500 group-hover:opacity-100" />
              <div className="relative w-full h-full bg-white dark:bg-black rounded-xl p-[20px] shadow-sm border border-slate-100 dark:border-slate-800 group-hover:border-[#4F46E5] group-hover:bg-[#F4F4F8] transition-colors duration-300 overflow-hidden z-10">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:-translate-y-1 transition-transform duration-300 relative z-10">
                  {feat.icon}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 relative z-10">{feat.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed relative z-10">
                  {feat.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Stride: Professional Financial Connectivity
