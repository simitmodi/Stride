"use client";

import { AnimateIn } from "./AnimateIn";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export function CtaSection() {

  return (
    <section className="w-full py-32 bg-gradient-to-b from-primary/5 to-primary/15 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <AnimateIn>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            Your Time Deserves <span className="text-primary">Better.</span>
          </h2>
        </AnimateIn>

        <AnimateIn delay={100}>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium mb-12">
            Book smarter. Visit once. Get it done.
          </p>
        </AnimateIn>

        <AnimateIn delay={200}>
          <Button asChild size="lg" className="rounded-full h-16 px-10 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
            <Link href="/signup/customer">
              Start Booking Now <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </AnimateIn>
      </div>
    </section>
  );
}

