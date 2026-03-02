"use client";

import { AnimateIn } from "./AnimateIn";
import { Clock, FileCheck, MapPin, BellRing, LayoutDashboard, Users } from "lucide-react";

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

export function FeaturesSection() {
  return (
    <section className="w-full py-24 bg-[#F3F4F6]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <AnimateIn>
          <div className="text-center md:text-left mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
              Built for First-Visit Success
            </h2>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <AnimateIn key={i} delay={feat.delay} className="group h-full">
              <div className="h-full bg-white rounded-xl p-[20px] shadow-sm border border-slate-100 hover:border-primary/50 transition-colors duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:-translate-y-1 transition-transform duration-300">
                  {feat.icon}
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
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
