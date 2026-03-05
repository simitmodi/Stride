"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Home,
  HelpCircle,
  User,
  CalendarCheck,
  Building2,
  Settings,
  BookUser,
  ArrowRight
} from "lucide-react";
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";
import { BackgroundWaves } from "@/components/landing/BackgroundWaves";

const faqCategories = [
  {
    category: 'General',
    icon: HelpCircle,
    questions: [
      {
        q: 'What is Stride?',
        a: 'Stride is an intelligent architecture designed to redefine the Indian banking experience. It empowers users to navigate appointments with clarity, precision guidance, and real-time intelligence.',
      },
      {
        q: 'How does Stride work?',
        a: 'Users synchronize with their bank of choice, select targeted services, and secure an optimized time slot. Our ecosystem then provides proactive preparation guides to ensure success.',
      },
      {
        q: 'Which banks are supported by Stride?',
        a: 'Stride is currently integrating with India’s leading financial institutions. Our network is expanding rapidly to cover all major city branches.',
      },
      {
        q: 'What if my bank is not listed on Stride?',
        a: 'You can register your institutional preference through our Feedback portal. We prioritize integration based on community demand.',
      },
      {
        q: 'Is Stride available across all cities in India?',
        a: 'We are deploying Stride in strategic phases across metropolitan hubs, with a nationwide rollout trajectory for total accessibility.',
      },
      {
        q: 'Do I need to pay to use Stride?',
        a: 'The Stride ecosystem is free for individual users. We focus on bridging the gap between customers and quality banking without financial barriers.',
      },
      {
        q: 'Does Stride support regional languages?',
        a: 'Inclusivity is core to our mission. Multilingual support for all major Indian languages is currently in active development.',
      },
      {
        q: 'What happens if Stride services are unavailable due to maintenance?',
        a: 'We maintain a 99.9% uptime goal. Any planned architectural maintenance is communicated in advance to ensure zero disruption to your financial life.',
      },
    ],
  },
  {
    category: 'User Accounts',
    icon: User,
    questions: [
      {
        q: 'Is my personal data safe on Stride?',
        a: 'Absolutely. Stride utilizes military-grade encryption and isolated data environments to ensure your information remains private and secure at all times.',
      },
      {
        q: 'Can I use Stride without creating an account?',
        a: 'To maintain the integrity of the security handshake between you and the bank, a verified Stride account is required.',
      },
      {
        q: 'Can I share my account with family members?',
        a: 'For security and data precision, each individual should maintain a unique Stride identity to manage their personal banking agenda.',
      },
      {
        q: 'How do I update my personal details?',
        a: 'Configuration of your digital identity can be managed instantly through your secure User Dashboard.',
      },
    ],
  },
  {
    category: 'Appointments',
    icon: CalendarCheck,
    questions: [
      {
        q: 'Can I reschedule or cancel an appointment?',
        a: 'Yes. The Stride command center allows for fluid management of your visits, allowing you to adapt your banking schedule to your life with a single click.',
      },
      {
        q: 'What happens if I miss an appointment?',
        a: 'While we provide proactive notifications to prevent misses, if a visit is overlooked, our system enables rapid re-scheduling to keep you on track.',
      },
      {
        q: 'Do I still need to carry documents to the bank?',
        a: 'Physical verification is often required by institutions. Stride provides a Document Mastery checklist for every service to ensure you are perfectly prepared.',
      },
      {
        q: 'Does booking through Stride guarantee faster service at the bank?',
        a: 'While final speed depends on branch workload, Stride users enter with prioritized preparation, significantly reducing administrative overhead for bank staff.',
      },
      {
        q: 'Can I use Stride for multiple banks?',
        a: 'Yes. Stride is a unified platform, allowing you to orchestrate your entire multi-bank agenda from one beautiful interface.',
      },
      {
        q: 'Can I book same-day appointments?',
        a: 'Elite synchronization with live bank capacity allows us to offer same-day slots whenever available.',
      },
    ],
  },
  {
    category: 'Bank Staff',
    icon: Building2,
    questions: [
      {
        q: 'Can bank staff also use Stride?',
        a: 'Yes. We provide dedicated banking portals that allow staff to view upcoming arrivals and prepare resources for elite service quality.',
      },
      {
        q: 'How do banks benefit from Stride?',
        a: 'Stride eliminates congestion, optimizes staff allocation, and improves customer satisfaction scores through streamlined arrival patterns.',
      },
    ],
  },
  {
    category: 'Technical',
    icon: Settings,
    questions: [
      {
        q: 'What devices can I use Stride on?',
        a: 'The Stride ecosystem is responsive across all modern web environments. Native iOS and Android experiences are currently in closed beta.',
      },
      {
        q: 'How will I be notified of my appointment?',
        a: 'Our intelligence layer sends multi-channel alerts via SMS, Email, and Push notifications to ensure you are always in sync.',
      },
      {
        q: 'What if I face technical issues while using Stride?',
        a: 'Our elite support engineers are ready to assist. You can initiate a support request directly from the Technical portal or reach out via email.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        <BackgroundWaves />
        <FloatingDoodles />
        {/* Extra Atmospheric Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      </div>

      <main className="relative z-10 w-full max-w-5xl px-4 md:px-8 py-24 flex flex-col items-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter drop-shadow-sm">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Find quick answers to common queries about Stride.
          </p>
        </motion.div>

        {/* FAQ Categories Section */}
        <div className="w-full space-y-12 mb-24">
          {faqCategories.map((category, catIdx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: 0.3 + catIdx * 0.2,
                duration: 1,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-[100px] shadow-2xl p-8 md:p-10 transition-colors duration-500 group-hover:bg-white/70 dark:group-hover:bg-slate-950/70">

                <div className="mb-8 flex items-center gap-5">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner"
                  >
                    <category.icon className="h-7 w-7" strokeWidth={1.5} />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {category.category}
                  </h2>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                  {category.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="[&:not(:last-child)]:border-b border-slate-200/50 dark:border-white/5 px-2 py-1"
                    >
                      <AccordionTrigger className="text-left text-lg font-bold text-slate-800 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors py-5 no-underline hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium pb-8">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Navigation & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="w-full max-w-3xl text-center space-y-16"
        >
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Still have questions?</h3>
            <div className="relative group mx-auto max-w-sm">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center p-1"
              >
                {/* Glow Layer */}
                <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full opacity-60 transition-opacity" />

                <Link
                  href="/contact"
                  className="relative flex items-center justify-center gap-4 py-5 px-14 bg-primary rounded-full shadow-[0_0_50px_rgba(79,70,229,0.4)] transition-all duration-500 hover:bg-primary/90 text-white"
                >
                  <span className="text-2xl font-bold tracking-tight">Contact Helpdesk</span>
                  <ArrowRight className="w-7 h-7 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="pt-12">
            <Button asChild variant="ghost" className="rounded-full text-slate-400 hover:text-primary hover:bg-primary/5 px-10 h-12 text-base font-bold">
              <Link href="/">
                <Home className="h-5 w-5 mr-3" />
                <span>Return Home</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Stride: Professional Financial Connectivity
