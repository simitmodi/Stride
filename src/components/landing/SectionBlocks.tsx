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
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 mb-6 leading-tight">
            Your Time Deserves <span className="text-primary">Better.</span>
          </h2>
        </AnimateIn>
        
        <AnimateIn delay={100}>
          <p className="text-xl md:text-2xl text-slate-600 font-medium mb-12">
            Book smarter. Visit once. Get it done.
          </p>
        </AnimateIn>

        <AnimateIn delay={200}>
          <Button asChild size="lg" className="rounded-full h-16 px-10 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
            <Link href="/signup">
              Start Booking Now <ArrowRight className="w-5 h-5 ml-2"/>
            </Link>
          </Button>
        </AnimateIn>
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer className="w-full py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <div className="font-bold text-2xl tracking-tight text-slate-900 mb-4">Stride</div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Seamlessly connecting customers and bank staff to eliminate waiting and improve banking experiences.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="mailto:support@stride.app" className="hover:text-primary transition-colors">support@stride.app</a></li>
              <li><a href="tel:+18005550199" className="hover:text-primary transition-colors">1-800-555-0199</a></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Stride Banking. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-slate-600">Twitter</span>
            <span className="cursor-pointer hover:text-slate-600">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
