"use client";

import { AnimateIn } from "./AnimateIn";
import { CopyX, FileBadge, Clock } from "lucide-react";
export function ProblemSection() {
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

  return (
    <section className="w-full py-24 bg-[#F4F4F8] dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <AnimateIn>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-900 dark:text-slate-100 mb-16 px-4">
            Why Bank Visits Still Feel Complicated
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((prob, i) => (
            <AnimateIn key={i} delay={prob.delay} className="group relative hover:-translate-y-2 transition-transform duration-500 ease-out h-full flex">
              <div className="absolute -inset-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl blur-xl opacity-60 transition duration-500 group-hover:opacity-100" />
              <div className="relative w-full h-full bg-white dark:bg-black border border-slate-100/50 dark:border-slate-800 group-hover:border-[#4F46E5] group-hover:bg-[#F4F4F8] transition-colors duration-300 shadow-sm rounded-2xl p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors z-10">
                  {prob.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 z-10">{prob.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed z-10">
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
