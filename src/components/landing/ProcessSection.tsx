"use client";

import { AnimateIn } from "./AnimateIn";

const steps = [
  {
    number: "1",
    title: "Choose Bank & Service",
    delay: 100,
  },
  {
    number: "2",
    title: "View Required Documents",
    delay: 200,
  },
  {
    number: "3",
    title: "Book Appointment",
    delay: 300,
  },
];

export function ProcessSection() {
  return (
    <section className="w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <AnimateIn>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-16">
              How Stride Works
            </h2>
          </AnimateIn>

          <div className="space-y-12 relative">
            {/* Connecting line */}
            <div className="absolute left-[24px] top-6 bottom-10 w-0.5 bg-slate-100 hidden md:block"></div>
            
            {steps.map((step, i) => (
              <AnimateIn key={i} delay={step.delay} className="relative flex items-center md:items-start gap-6 group">
                {/* Number Badge */}
                <div className="relative z-10 w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl border-2 border-white lg:group-hover:bg-primary lg:group-hover:text-white transition-colors duration-300">
                  {step.number}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                    {step.title}
                  </h3>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>

        {/* Minimal Animated Illustration Placeholder */}
        <AnimateIn delay={400} className="hidden lg:flex justify-center">
          <div className="w-full max-w-md aspect-square relative flex items-center justify-center">
            {/* Blob behind */}
            <div className="absolute inset-0 bg-primary/5 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 bg-primary/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-[spin_15s_linear_infinite_reverse]" />
            
            <div className="relative z-10 w-3/4 h-3/4 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center p-8 overflow-hidden">
               {/* inner fake UI */}
               <div className="w-full h-full flex flex-col gap-4 opacity-50">
                  <div className="w-3/4 h-8 bg-slate-100 rounded-md"></div>
                  <div className="w-full h-24 bg-primary/10 rounded-xl"></div>
                  <div className="w-5/6 h-8 bg-slate-100 rounded-md"></div>
                  <div className="w-1/2 h-12 bg-primary/20 rounded-full mt-auto self-end"></div>
               </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
