'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { checklistData } from '@/lib/document-checklist-data';
import type { ChecklistItem as ChecklistItemType } from '@/lib/document-checklist-data';
import Link from 'next/link';
import { ArrowRight, ChevronRight, FileText, CheckCircle2, Circle, Info, LayoutList, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShinyText from '@/components/ShinyText';
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
    <div className="min-h-screen w-full bg-[#F4F4F8]">
      {/* ─── Top Bar: Category Tabs ─── */}
      <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm shadow-slate-900/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Desktop Version: Horizontal Tabs */}
          <div className="hidden lg:flex items-center gap-2 py-4 overflow-x-auto scrollbar-none">
            <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-400 mr-2 shrink-0">Services</span>
            <div className="h-6 w-px bg-slate-200 shrink-0" />
            {checklistData.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.button
                  key={section.category}
                  onClick={() => handleCategoryChange(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={springPop}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shrink-0",
                    "transition-colors duration-300",
                    activeCategory === index
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {/* Animated pill background */}
                  {activeCategory === index && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/25"
                      transition={springSmooth}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {section.category}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Mobile Version: Expandable Dropdown Selector */}
          <div className="lg:hidden py-3 relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-between w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 shadow-sm hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-center gap-2.5 text-indigo-900 font-semibold text-sm">
                <FileText className="w-4 h-4 text-indigo-400" />
                Category: 
                <span className="font-bold">{checklistData[activeCategory].category}</span>
              </div>
              <ChevronRight className={cn("w-5 h-5 text-indigo-400 transition-transform duration-300", isMobileMenuOpen ? "rotate-[-90deg]" : "rotate-90")} />
            </button>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={springBouncy}
                  className="absolute left-4 right-4 top-[calc(100%+4px)] bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden z-50 flex flex-col p-1.5"
                >
                  {checklistData.map((section, index) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.category}
                        onClick={() => {
                          handleCategoryChange(index);
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                          activeCategory === index 
                            ? "bg-indigo-50 text-indigo-700" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <Icon className={cn("w-4 h-4", activeCategory === index ? "text-indigo-600" : "text-slate-400")} />
                        {section.category}
                        {activeCategory === index && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Main Content: Split Layout ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-[calc(100vh-120px)] relative overflow-hidden lg:overflow-visible">

          {/* ─── Left Panel: Document List ─── */}
          {/* Hidden on mobile if viewing details */}
          <div className={cn(
            "lg:w-[340px] xl:w-[380px] shrink-0 lg:block",
            isMobileDetailView ? "hidden" : "block"
          )}>
            <div className="sticky top-[85px]">
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
              <div ref={listContainerRef} className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 scrollbar-none">
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
                              activeItem === index ? "text-slate-900" : "text-slate-500"
                            )}>
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
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
            "flex-1 min-w-0 lg:block",
            isMobileDetailView ? "block" : "hidden"
          )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${activeItem}`}
                variants={detailVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="bg-white rounded-2xl shadow-xl shadow-slate-900/[0.04] border border-slate-200/60 overflow-hidden"
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
                <div className="px-6 sm:px-8 py-6 sm:py-8">
                  <DetailContent key={`${activeCategory}-${activeItem}`} item={selectedItem} />
                </div>

                {/* Detail Footer */}
                <div className="px-6 sm:px-8 py-5 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

            {/* Navigation Arrows */}
            <div className="flex items-center justify-between mt-4 px-2">
              <motion.button
                onClick={() => activeItem > 0 && handleItemClick(activeItem - 1)}
                disabled={activeItem === 0}
                whileHover={activeItem > 0 ? { x: -3 } : {}}
                whileTap={activeItem > 0 ? { scale: 0.95 } : {}}
                transition={springPop}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg",
                  activeItem === 0
                    ? "text-slate-200 cursor-not-allowed"
                    : "text-slate-500 hover:text-indigo-600 hover:bg-white"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </motion.button>
              <motion.button
                onClick={() => activeItem < activeData.items.length - 1 && handleItemClick(activeItem + 1)}
                disabled={activeItem === activeData.items.length - 1}
                whileHover={activeItem < activeData.items.length - 1 ? { x: 3 } : {}}
                whileTap={activeItem < activeData.items.length - 1 ? { scale: 0.95 } : {}}
                transition={springPop}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg",
                  activeItem === activeData.items.length - 1
                    ? "text-slate-200 cursor-not-allowed"
                    : "text-slate-500 hover:text-indigo-600 hover:bg-white"
                )}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
