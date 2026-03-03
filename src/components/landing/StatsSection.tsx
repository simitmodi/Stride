"use client";

import { AnimateIn } from "./AnimateIn";
import { ShieldCheck, CheckCircle2, Zap } from "lucide-react";
import { landingTranslations, LanguageCode } from "@/lib/landing-i18n";

export function StatsSection({ lang }: { lang: LanguageCode }) {
  const t = landingTranslations[lang];

  return (
    <section className="w-full py-24 bg-white dark:bg-background border-y border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          <AnimateIn delay={100} className="py-8 flex flex-col items-center justify-center">
            <ShieldCheck className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t.stat1Title}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">{t.stat1Desc}</p>
          </AnimateIn>

          <AnimateIn delay={200} className="py-8 flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t.stat2Title}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">{t.stat2Desc}</p>
          </AnimateIn>

          <AnimateIn delay={300} className="py-8 flex flex-col items-center justify-center">
            <Zap className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t.stat3Title}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">{t.stat3Desc}</p>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
