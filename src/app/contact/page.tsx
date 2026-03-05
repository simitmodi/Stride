"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Github,
  Users,
  HelpCircle,
  Rocket,
  Send,
  MessageSquare,
  ArrowRight,
  Home,
  Headset,
  CalendarCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactFloatingBackground } from "@/components/landing/ContactFloatingBackground";
import { BackgroundWaves } from "@/components/landing/BackgroundWaves";
import { useToast } from "@/hooks/use-toast";

const projectDetails = [
  {
    icon: Github,
    title: "Source Code",
    value: "GitHub Repository",
    description: "Explore the codebase and technical architecture of Stride.",
    color: "bg-slate-900/20 text-slate-900 dark:bg-white/10 dark:text-white",
    link: "https://github.com/simitmodi/Stride"
  },
  {
    icon: Users,
    title: "Meet the Creators",
    value: "Developer Team",
    description: "Discover the visionary team behind this project.",
    color: "bg-indigo-500/20 text-indigo-500",
    link: "/developers"
  },
  {
    icon: HelpCircle,
    title: "Help Center",
    value: "Common Questions",
    description: "Find instant answers to frequently asked questions about Stride.",
    color: "bg-emerald-500/20 text-emerald-500",
    link: "/faq"
  }
];

export default function ContactPage() {
  const { toast } = useToast();

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 py-24 md:py-32">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        <ContactFloatingBackground />
        <BackgroundWaves />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      </div>

      <main className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16 md:mb-24"
        >
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter drop-shadow-sm">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Explore the architecture of Stride and connect with our team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
          {/* Left: Quick Links */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            {projectDetails.map((detail, index) => (
              <motion.div
                key={detail.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

                <Link
                  href={detail.link}
                  className="relative flex items-start gap-6 p-8 rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl shadow-xl transition-all duration-500 group-hover:bg-white/70 dark:group-hover:bg-slate-900/60 block"
                >
                  <div className={`shrink-0 w-14 h-14 rounded-2xl ${detail.color} flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <detail.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest">{detail.title}</h3>
                    <p className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {detail.value}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{detail.description}</p>
                  </div>
                  <div className="absolute top-8 right-8 text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Additional Evolution Option */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-8 rounded-[2rem] border border-primary/20 bg-primary/5 backdrop-blur-3xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <Rocket className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Stride Evolution</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium mb-6">
                Explore our planned milestones and the future vision for the next generation of Stride.
              </p>
              <Button
                onClick={() => toast({
                  title: "Roadmap Explorer",
                  description: "The interactive Roadmap module is currently being finalized for Phase 8.",
                })}
                className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-lg shadow-primary/20 transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  Explore Roadmap <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </motion.div>
          </div>

          {/* Right: Feedback Form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="relative group h-full"
            >
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 via-transparent to-accent/30 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-700 pointer-events-none" />

              <div className="relative h-full p-8 md:p-12 rounded-[2.5rem] border border-white/50 dark:border-white/10 bg-white/70 dark:bg-slate-950/70 backdrop-blur-[100px] shadow-2xl">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Direct Feedback</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-10">We appreciate your insights and suggestions.</p>

                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Feedback Submitted",
                      description: "Thank you for your thoughts! Our team will review your message soon.",
                    });
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-4">Full Name</label>
                      <Input
                        required
                        placeholder="Enter your name"
                        className="h-14 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 focus:ring-primary/20 backdrop-blur-md transition-all text-lg px-6"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-4">Email Address</label>
                      <Input
                        required
                        type="email"
                        placeholder="name@example.com"
                        className="h-14 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 focus:ring-primary/20 backdrop-blur-md transition-all text-lg px-6"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-4">Subject</label>
                    <Input
                      required
                      placeholder="What's this about?"
                      className="h-14 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 focus:ring-primary/20 backdrop-blur-md transition-all text-lg px-6"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-4">Message</label>
                    <Textarea
                      required
                      placeholder="Tell us what you need..."
                      className="min-h-[160px] rounded-2xl bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 focus:ring-primary/20 backdrop-blur-md transition-all text-lg p-6 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-16 rounded-[1.5rem] bg-primary text-white text-xl font-bold tracking-tight shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:bg-primary/90 hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all duration-500 group/btn"
                  >
                    <span className="flex items-center justify-center gap-3">
                      Submit Feedback <Send className="w-6 h-6 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </span>
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-20"
        >
          <Button asChild variant="ghost" size="lg" className="rounded-full text-slate-400 hover:text-primary hover:bg-primary/5 px-10 h-12 text-base font-bold">
            <Link href="/">
              <Home className="h-5 w-5 mr-3" />
              <span>Return Home</span>
            </Link>
          </Button>
        </motion.div>
      </main>
    </div>
  );
}

// Stride: Professional Financial Connectivity
