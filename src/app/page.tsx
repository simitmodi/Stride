"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from '@/lib/Logo.png';
import { ArrowRight, Globe, ArrowDownUp, User } from "lucide-react";
import { landingTranslations, languages, LanguageCode } from "@/lib/landing-i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ProblemSection } from "@/components/landing/ProblemSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CtaSection } from "@/components/landing/SectionBlocks";

export default function Home() {
  const [lang, setLang] = useState<LanguageCode>('en');
  const t = landingTranslations[lang];
  const selectedLangName = languages.find(l => l.code === lang)?.name || 'English';

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Image src={Logo} alt="Stride Logo" width={180} height={60} className="w-auto h-12" />
        </div>
        
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-2 bg-secondary/50 rounded-full p-1 backdrop-blur-sm">
          <Link href="/" className="px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:shadow-sm transition-all text-[#0F1729]">{t.home}</Link>
          <Link href="/about" className="px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:shadow-sm transition-all text-muted-foreground hover:text-[#0F1729]">{t.aboutUs}</Link>
          <Link href="/faq" className="px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:shadow-sm transition-all text-muted-foreground hover:text-[#0F1729]">{t.faq}</Link>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium cursor-pointer text-[#0F1729] hover:text-primary transition-colors">
                <Globe className="w-4 h-4" /> {selectedLangName}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              {languages.map((l) => (
                <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)} className="cursor-pointer">
                  {l.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">{t.login}</Link>
          <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Link href="/signup">{t.signup} <ArrowRight className="w-4 h-4 ml-2"/></Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-1 flex-col items-center pt-32 pb-16 px-4">
        
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-primary text-sm font-medium mb-8">
            <User className="w-4 h-4" /> {t.heroTag}
          </div>
          
          <h1 className="text-balance text-6xl md:text-8xl font-bold tracking-tighter text-[#0F1729] leading-[1.1] mb-6 whitespace-pre-line">
            {t.heroTitle}
          </h1>
          
          <p className="max-w-[500px] text-balance text-muted-foreground md:text-lg mb-10">
            {t.heroSubtitle}
          </p>
          
          <Button asChild size="lg" className="rounded-full h-14 px-8 text-base bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 hover:scale-105 transition-all duration-300">
            <Link href="/login">{t.getStarted} <ArrowRight className="w-5 h-5 ml-2"/></Link>
          </Button>
        </div>

        {/* Feature Cards Grid (Inspired by the reference image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-24">
          
          {/* Card 1: Upcoming Appointment */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 flex flex-col justify-between min-h-[300px] hover:-translate-y-2 transition-transform duration-500">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{t.upcomingAppointment}</p>
              <h3 className="text-4xl font-bold text-[#0F1729] mb-6">{t.tomorrow}</h3>
              
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center my-4 ml-8 relative shadow-inner">
                 <User className="w-5 h-5 text-blue-500" />
              </div>

              <p className="text-sm font-medium text-muted-foreground mb-1 mt-4">{t.branch}</p>
              <h3 className="text-2xl font-bold text-[#0F1729]">{t.downtownWest}</h3>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">{t.status}</p>
              <p className="text-sm font-bold text-emerald-500 mt-1">{t.confirmed}</p>
            </div>
          </div>

          {/* Card 2: Center Highlight */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-[2.5rem] p-10 shadow-[0_20px_40px_rgba(139,92,246,0.3)] text-white flex flex-col justify-between min-h-[300px] md:scale-105 z-10 hover:scale-110 transition-transform duration-500">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-8">
                <Globe className="w-3 h-3" /> {t.userFriendly}
              </div>
              <h2 className="text-4xl font-bold leading-tight mb-4">{t.bookManage}</h2>
            </div>
            
            <p className="text-white/80 font-medium leading-relaxed">
              {t.customerStaff}
            </p>
          </div>

          {/* Card 3: Staff Availability */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 flex flex-col justify-between min-h-[300px] hover:-translate-y-2 transition-transform duration-500">
             <div className="flex justify-between items-start mb-6">
                <div className="bg-secondary px-4 py-2 rounded-2xl text-sm font-medium text-[#0F1729]">{t.staffAvailability}</div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-white flex items-center justify-center text-white text-xs"><User className="w-4 h-4"/></div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs"><User className="w-4 h-4"/></div>
                </div>
             </div>

             <div>
                <h3 className="text-4xl font-bold text-[#0F1729] mb-2">{t.slotsAvailable}</h3>
                <p className="text-emerald-500 text-sm font-medium flex items-center gap-1">{t.availableToday}</p>
             </div>

             <div className="mt-8 h-24 w-full relative">
                {/* Mock Chart line */}
                <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                  <path d="M0,30 C20,10 40,50 60,30 C80,10 100,40 120,20 C140,0 160,50 180,30 C190,20 200,30 200,30" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/30" />
                  <path d="M0,30 L20,15 L40,45 L60,30 L80,15 L100,35 L120,20 L140,5 L160,40 L180,25 L200,30" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <circle cx="20" cy="15" r="3" fill="currentColor" className="text-primary" />
                  <circle cx="60" cy="30" r="3" fill="currentColor" className="text-primary" />
                  <circle cx="120" cy="20" r="3" fill="currentColor" className="text-primary" />
                  <circle cx="160" cy="40" r="3" fill="currentColor" className="text-primary" />
                </svg>
                {/* Overlay lines */}
                <div className="absolute inset-0 flex justify-between">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="h-full w-px bg-border/50"></div>)}
                </div>
             </div>
             
             <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-medium uppercase">
                <span>9am</span><span>11am</span><span>1pm</span><span>3pm</span><span className="text-[#0F1729] font-bold">5pm</span>
             </div>
          </div>

        </div>

      </main>
      
      <ProblemSection />
      <ProcessSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialSection />
      <CtaSection />
    </div>
  );
}
