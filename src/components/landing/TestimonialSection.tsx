"use client";

import { AnimateIn } from "./AnimateIn";
import { User } from "lucide-react";
import { landingTranslations, LanguageCode } from "@/lib/landing-i18n";

export function TestimonialSection({ lang }: { lang: LanguageCode }) {
  const t = landingTranslations[lang];

  return (
    <section className="w-full py-32 bg-white dark:bg-black relative overflow-hidden">
      {/* decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        <AnimateIn>
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-3xl p-8 md:p-16 border border-slate-100 dark:border-slate-800 shadow-[0_0_40px_-15px_rgba(9,154,174,0.3)] text-center transition-all duration-500 hover:shadow-[0_0_60px_-15px_rgba(9,154,174,0.4)]">

            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 dark:bg-black border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center mb-8 relative">
              <User className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              {/* online dot indicator */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
            </div>

            <blockquote className="text-2xl md:text-3xl font-medium text-slate-800 dark:text-slate-200 leading-snug mb-8">
              {t.testQuote}
            </blockquote>

            <div className="text-sm">
              <p className="font-bold text-slate-900 dark:text-slate-100">{t.testName}</p>
              <p className="text-slate-500 dark:text-slate-400">{t.testRole}</p>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
