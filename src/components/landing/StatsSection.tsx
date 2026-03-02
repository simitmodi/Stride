"use client";

import { AnimateIn } from "./AnimateIn";
import { useEffect, useState } from "react";

function Counter({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease out expo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [started, end, duration]);

  return (
    <div 
      className="text-5xl md:text-6xl font-bold text-slate-900 tabular-nums"
      ref={(el) => {
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        });
        observer.observe(el);
      }}
    >
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="w-full py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <AnimateIn delay={100} className="py-4">
            <Counter end={1000} suffix="+" />
            <div className="w-12 h-1 bg-primary mx-auto mt-4 mb-3 rounded-full"></div>
            <p className="text-slate-500 font-medium">Appointments Booked</p>
          </AnimateIn>
          
          <AnimateIn delay={200} className="py-4">
            <Counter end={95} suffix="%" />
            <div className="w-12 h-1 bg-primary mx-auto mt-4 mb-3 rounded-full"></div>
            <p className="text-slate-500 font-medium">First-Visit Completion</p>
          </AnimateIn>

          <AnimateIn delay={300} className="py-4">
            <Counter end={50} suffix="+" />
            <div className="w-12 h-1 bg-primary mx-auto mt-4 mb-3 rounded-full"></div>
            <p className="text-slate-500 font-medium">Branches Integrated</p>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
