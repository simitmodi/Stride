'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { checklistData } from '@/lib/document-checklist-data';
import type { ChecklistItem as ChecklistItemType } from '@/lib/document-checklist-data';
import Link from 'next/link';
import { ArrowRight, ChevronRight, CheckCircle2, Circle, Info, LayoutList, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShinyText from '@/components/ShinyText';
import { FloatingDoodles } from '@/components/landing/FloatingDoodles';
import { cn } from '@/lib/utils';

/* ─── Spring configs ─── */
const springPop = { type: 'spring' as const, stiffness: 400, damping: 25 };
const springSmooth = { type: 'spring' as const, stiffness: 300, damping: 30 };
const springBouncy = { type: 'spring' as const, stiffness: 500, damping: 28 };

/* ─── Badge Components ─── */
const RequiredBadge = () => (
  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 shrink-0">
    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
    Required
  </span>
);

const OptionalBadge = () => (
  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200 shrink-0">
    Optional
  </span>
);

const OptionChip = ({ label, index }: { label: string; index: number }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ ...springBouncy, delay: 0.3 + index * 0.04 }}
    whileHover={{ scale: 1.08, y: -1 }}
    className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 cursor-default"
  >
    {label}
  </motion.span>
);

/* ─── Animated Content Row ─── */
const contentRowVariants = {
  hidden: { opacity: 0, x: -20, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      ...springSmooth,
      delay: 0.08 * i,
    },
  }),
};

/* ─── Detail Content Renderer ─── */
const DetailContent = ({ item }: { item: ChecklistItemType }) => {
  return (
    <div className="space-y-4">
      {item.content.map((c, index) => {
        let inner: React.ReactNode = null;
        switch (c.type) {
          case 'required':
            inner = (
              <div className="flex items-start gap-3 group">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...springBouncy, delay: 0.1 * index }}
                >
                  <CheckCircle2 className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                </motion.div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 min-w-0">
                  <span className="text-slate-800 text-[15px] leading-relaxed">{c.text}</span>
                  <RequiredBadge />
                </div>
              </div>
            );
            break;
          case 'optional':
            inner = (
              <div className="flex items-start gap-3 group">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...springBouncy, delay: 0.1 * index }}
                >
                  <Circle className="w-4 h-4 text-zinc-300 mt-0.5 shrink-0" />
                </motion.div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 min-w-0">
                  <span className="text-slate-600 text-[15px] leading-relaxed">{c.text}</span>
                  <OptionalBadge />
                </div>
              </div>
            );
            break;
          case 'options':
            inner = (
              <div className="flex items-start gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...springBouncy, delay: 0.1 * index }}
                >
                  <LayoutList className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                </motion.div>
                <div className="space-y-2 min-w-0">
                  <span className="text-slate-800 text-[15px] leading-relaxed block">{c.text}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.choices?.map((choice, ci) => (
                      <OptionChip key={ci} label={choice} index={ci} />
                    ))}
                  </div>
                </div>
              </div>
            );
            break;
          case 'note':
            inner = (
              <div className="flex items-start gap-3 ml-7 p-3 rounded-lg bg-violet-50 border border-violet-100">
                <Info className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                <span className="text-sm text-violet-600/80 italic leading-relaxed">{c.text}</span>
              </div>
            );
            break;
        }
        return (
          <motion.div
            key={`${item.title}-${index}`}
            custom={index}
            variants={contentRowVariants}
            initial="hidden"
            animate="visible"
          >
            {inner}
          </motion.div>
        );
      })}
    </div>
  );
};

/* ─── List item variants ─── */
const listItemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      ...springSmooth,
      delay: 0.04 * i,
    },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

/* ─── Detail panel variants ─── */
const detailVariants = {
  enter: {
    opacity: 0,
    x: 60,
    scale: 0.97,
    filter: 'blur(8px)',
  },
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: springSmooth,
  },
  exit: {
    opacity: 0,
    x: -40,
    scale: 0.97,
    filter: 'blur(8px)',
    transition: { duration: 0.2 },
  },
};

/* ─── Main Page ─── */
export default function DocumentChecklistPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const activeData = checklistData[activeCategory];
  const selectedItem = activeData.items[activeItem];

  const handleCategoryChange = (index: number) => {
    if (index === activeCategory) {
      setIsMobileDetailView(false); // tapping active category tab returns to list on mobile
      return; 
    }
    setActiveCategory(index);
    setActiveItem(0);
    setIsMobileDetailView(false); // reset to list view on category change
  };

  const handleItemClick = (index: number) => {
    setActiveItem(index);
    setIsMobileDetailView(true); // switch to detail view on mobile
  };

  // Scroll list item into view on mobile list
  useEffect(() => {
    if (listContainerRef.current && !isMobileDetailView) {
      const activeBtn = listContainerRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeItem, isMobileDetailView]);

  const requiredCount = selectedItem.content.filter(c => c.type === 'required').length;
  const optionalCount = selectedItem.content.filter(c => c.type === 'optional').length;

  return (
    <div className="w-full min-h-screen pb-12 relative overflow-hidden flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingDoodles />
      </div>
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <style>{`
          .ambient-glow { filter: blur(140px); border-radius: 9999px; position: fixed; }
        `}</style>
        <div className="ambient-glow w-[50vw] h-[50vh] bg-indigo-500/10 top-[-10%] left-[-10%]" />
        <div className="ambient-glow w-[40vw] h-[40vh] bg-purple-500/10 bottom-[10%] right-[-5%]" />
        <div className="ambient-glow w-[30vw] h-[30vh] bg-blue-400/5 top-[40%] right-[30%]" />
      </div>

      {/* ─── Main Content: Split Layout ─── */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-[104px] pb-[160px] relative z-10 flex-1 flex flex-col min-h-0">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 min-h-0 relative">

          {/* ─── Left Panel: Document List ─── */}
          {/* Hidden on mobile if viewing details */}
          <div className={cn(
            "lg:w-[340px] xl:w-[380px] 2xl:w-[420px] shrink-0 rounded-3xl p-4 lg:p-5 flex-col h-fit max-h-full overflow-hidden",
            "bg-white/70 backdrop-blur-2xl border border-white shadow-xl shadow-slate-200/50",
            isMobileDetailView ? "hidden lg:flex" : "flex"
          )}>
            <div className="flex flex-col flex-1 min-h-0">
              {/* Category Header */}
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springSmooth}
                className="mb-4"
              >
                <div className="flex items-center gap-3 mb-1">
                  <motion.div
                    initial={{ rotate: -90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={springBouncy}
                  >
                    {React.createElement(activeData.icon, { className: "w-6 h-6 text-indigo-600" })}
                  </motion.div>
                  <h1 className="text-xl font-bold text-slate-900 font-headline">{activeData.category}</h1>
                </div>
                <p className="text-sm text-slate-400 ml-9">{activeData.items.length} services</p>
              </motion.div>

              {/* Document List */}
              <div ref={listContainerRef} className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-none scroll-smooth">
                <AnimatePresence mode="popLayout">
                  {activeData.items.map((item, index) => {
                    const itemRequired = item.content.filter(c => c.type === 'required').length;
                    return (
                      <motion.button
                        key={`${activeCategory}-${index}`}
                        custom={index}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        data-active={activeItem === index}
                        onClick={() => handleItemClick(index)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                          "w-full text-left px-4 py-3.5 rounded-xl group relative",
                          activeItem === index
                            ? "bg-white shadow-md shadow-indigo-600/[0.06]"
                            : "hover:bg-white/60"
                        )}
                      >
                        {/* Active indicator bar with layout animation */}
                        {activeItem === index && (
                          <motion.div
                            layoutId="activeListBar"
                            className="absolute left-1 top-[22px] -translate-y-1/2 w-1 h-[26px] rounded-full bg-indigo-600"
                            transition={springSmooth}
                          />
                        )}

                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className={cn(
                              "text-sm font-semibold transition-colors duration-200 truncate",
                              activeItem === index ? "text-slate-900" : "text-slate-600"
                            )}>
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {itemRequired} required · {item.content.length} total
                            </p>
                          </div>
                          <motion.div
                            animate={{
                              x: activeItem === index ? 0 : -4,
                              opacity: activeItem === index ? 1 : 0,
                            }}
                            transition={springPop}
                          >
                            <ChevronRight className={cn(
                              "w-4 h-4 shrink-0",
                              activeItem === index ? "text-indigo-600" : "text-slate-300"
                            )} />
                          </motion.div>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ─── Right Panel: Detail View ─── */}
          {/* Hidden on mobile if viewing list */}
          <div className={cn(
            "flex-1 min-w-0 lg:block h-fit max-h-full flex flex-col",
            isMobileDetailView ? "block" : "hidden"
          )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${activeItem}`}
                variants={detailVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="bg-white/80 backdrop-blur-3xl rounded-3xl shadow-xl shadow-slate-900/[0.04] border border-slate-200/60 overflow-hidden flex flex-col h-fit max-h-full"
              >
                {/* Detail Header */}
                <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-slate-100">
                  {/* Mobile Back Button */}
                  <button 
                    onClick={() => setIsMobileDetailView(false)} 
                    className="lg:hidden flex items-center gap-2 text-sm text-indigo-600 font-semibold mb-4 group -ml-2 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to services
                  </button>

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...springSmooth, delay: 0.1 }}
                        className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline leading-tight"
                      >
                        {selectedItem.title}
                      </motion.h2>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...springSmooth, delay: 0.15 }}
                        className="flex items-center gap-3 mt-2"
                      >
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <span className="w-2 h-2 rounded-full bg-rose-500/70" />
                          {requiredCount} required
                        </span>
                        {optionalCount > 0 && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                            {optionalCount} optional
                          </span>
                        )}
                      </motion.div>
                    </div>

                    {/* Item Number Indicator */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...springBouncy, delay: 0.2 }}
                      className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full shrink-0 lg:-mt-2"
                    >
                      <span className="text-xs font-bold text-indigo-700">{activeItem + 1}</span>
                      <span className="text-xs text-indigo-300">/</span>
                      <span className="text-xs text-indigo-400">{activeData.items.length}</span>
                    </motion.div>
                  </div>
                </div>

                {/* Detail Content */}
                <div className="px-6 sm:px-8 py-6 sm:py-8 min-h-[300px] relative">
                  <div className="flex-1 relative z-10">
                    <DetailContent key={`${activeCategory}-${activeItem}`} item={selectedItem} />
                  </div>
                </div>

                {/* Detail Footer */}
                <div className="px-6 sm:px-8 py-5 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs text-rose-500/80 font-medium flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Items marked &quot;Required&quot; are compulsory
                  </motion.p>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={springPop}
                    className="w-full sm:w-auto"
                  >
                    <Button asChild variant="outline" className="w-full sm:w-auto border-indigo-200 bg-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors duration-300 px-5 group hover:shadow-lg hover:shadow-indigo-600/20">
                      <Link href="/dashboard/customer/appointment-scheduling" className="flex items-center justify-center gap-2 w-full">
                        <ShinyText text="Book Appointment" disabled={false} speed={2} className="font-semibold text-sm group-hover:!text-white" />
                        <ArrowRight className="h-4 w-4 text-indigo-600 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Floating Navigation Dock ─── */}
      <div className="fixed bottom-6 w-full px-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto z-50 pointer-events-none flex justify-center">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
          className="flex items-center gap-2 p-2 bg-white/80 backdrop-blur-2xl border border-white max-w-[100%] shadow-2xl shadow-indigo-900/10 rounded-[20px] pointer-events-auto"
        >
          {checklistData.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeCategory === index;
            
            return (
              <motion.button
                key={section.category}
                onClick={() => handleCategoryChange(index)}
                className={cn(
                  "relative flex items-center justify-center gap-2.5 px-4 h-12 rounded-xl transition-all duration-300 shrink-0",
                  isActive 
                    ? "text-white" 
                    : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                )}
                whileHover={{ scale: 1.05, y: isActive ? 0 : -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div 
                    layoutId="dockIndicatorBg"
                    className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30"
                    transition={springSmooth}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2.5 font-semibold text-sm">
                  <Icon className="w-4 h-4" />
                  {section.category}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

// Stride: Professional Financial Connectivity
