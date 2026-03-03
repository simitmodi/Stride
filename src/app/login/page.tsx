'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, User, Banknote, Folder, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/lib/Logo.png';
import { AnimatedRightSide } from '@/components/auth/AnimatedRightSide';
import { motion, Variants } from 'framer-motion';

export default function LoginOptionsPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen w-full bg-[#111111] overflow-hidden"
    >

      {/* ─── LEFT COLUMN: Selection (Solid Light Theme) ─── */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex lg:flex-1 w-full flex-col bg-[#F4F4F8] px-6 md:w-1/2 lg:px-16 xl:px-24 z-10 relative rounded-r-[40px] shadow-[8px_0_30px_rgba(0,0,0,0.1)] h-full overflow-y-auto scrollbar-hide items-center"
      >
        <div className="min-h-full flex flex-col py-12 w-full items-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto w-full max-w-md my-auto"
        >
          <motion.div variants={itemVariants} className="mb-10 text-center">
            <Image
              src={Logo}
              alt="Stride Logo"
              width={180}
              height={180}
              className="mb-6 mx-auto inline-block"
            />
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
              Welcome to Stride
            </h1>
            <p className="text-gray-500 text-lg">
              Choose your role to continue.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            <motion.div variants={itemVariants}>
              <Link href="/login/customer" className="group block">
                <div className="flex flex-row items-center gap-6 p-6 rounded-3xl transition-all duration-300 ease-in-out hover:bg-white/50">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 shadow-sm">
                    <User className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 leading-none mb-2">Customer Login</h3>
                    <p className="text-sm text-gray-500 font-medium leading-tight">
                      Access your personal account securely.
                    </p>
                  </div>
                  <ArrowRight className="h-6 w-6 shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-600" />
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/login/bank" className="group block">
                <div className="flex flex-row items-center gap-6 p-6 rounded-3xl transition-all duration-300 ease-in-out hover:bg-white/50">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 shadow-sm">
                    <Banknote className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 leading-none mb-2">Bank Login</h3>
                    <p className="text-sm text-gray-500 font-medium leading-tight">
                      Access the employee & ops portal.
                    </p>
                  </div>
                  <ArrowRight className="h-6 w-6 shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-600" />
                </div>
              </Link>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-10 text-center text-sm font-medium">
            <Link href="/" className="text-gray-500 underline hover:text-indigo-600 transition-colors inline-flex items-center gap-1">
              &larr; Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>

      {/* ─── RIGHT COLUMN: Video / Animated Presentation ─── */}
      <AnimatedRightSide />
    </motion.div>
  );
}
