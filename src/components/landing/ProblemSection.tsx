"use client";

import { AnimateIn } from "./AnimateIn";
import { CopyX, FileBadge, Clock } from "lucide-react";

const problems = [
  {
    icon: <CopyX className="w-6 h-6 text-primary" />,
    title: "Multiple Visits",
    description: "Going back and forth for a single request just because of scheduling issues.",
    delay: 100,
  },
  {
    icon: <FileBadge className="w-6 h-6 text-primary" />,
    title: "Missing Documents",
    description: "Arriving at the branch only to find out you're missing a critical signature.",
    delay: 200,
  },
  {
    icon: <Clock className="w-6 h-6 text-primary" />,
    title: "Long Waiting Time",
    description: "Wasting hours in line despite booking a slot over the phone.",
    delay: 300,
  },
];

export function ProblemSection() {
  return (
    <section className="w-full py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <AnimateIn>
          <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 mb-16">
            Why Bank Visits Still Feel Complicated
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((prob, i) => (
            <AnimateIn key={i} delay={prob.delay} className="group">
              <div className="bg-white border border-slate-100/50 shadow-sm rounded-2xl p-8 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-500 ease-in-out cursor-default">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  {prob.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{prob.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {prob.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
