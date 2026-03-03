"use client";

import { CustomerLoginForm } from "@/components/auth/customer-login-form";
import { AnimatedRightSide } from "@/components/auth/AnimatedRightSide";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/lib/Logo.png";
import { motion, Variants } from "framer-motion";

export default function CustomerLoginPage() {
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
      {/* Left Column - Form */}
      <motion.div 
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex lg:flex-1 w-full flex-col px-8 lg:p-12 xl:p-24 relative z-10 bg-[#F4F4F8] rounded-r-[40px] shadow-[8px_0_30px_rgba(0,0,0,0.1)] h-full overflow-y-auto scrollbar-hide items-center"
      >
        <div className="min-h-full flex flex-col py-12 w-full items-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md mx-auto my-auto"
          >
            <motion.div variants={itemVariants} className="mb-10 text-center">
              <Link href="/login" className="inline-block">
                <Image src={Logo} alt="Stride" width={140} height={42} className="mb-8 mx-auto drop-shadow-sm" />
              </Link>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
                Welcome back
              </h1>
              <p className="text-lg text-gray-500 font-medium">
                Log in to your Stride account.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <CustomerLoginForm />

              <p className="mt-8 text-center text-sm text-gray-500 px-1">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup/customer"
                  className="font-medium text-indigo-600 underline-offset-4 hover:underline transition-colors focus-visible:outline-none"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Column - Video */}
      <AnimatedRightSide />
    </motion.div>
  );
}
