
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail, sendPasswordReset } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Loader2, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogDescription as DialogDescriptionComponent } from "@/components/ui/dialog";

const formSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export function CustomerLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { emailOrUsername: "", password: "" },
  });

  const {
    register: registerFP,
    handleSubmit: handleSubmitFP,
    reset: resetFP,
    watch: watchFP,
    formState: { errors: errorsFP },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const emailValue = watch("emailOrUsername");
  const passwordValue = watch("password");
  const fpEmailValue = watchFP("email");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const user = await signInWithEmail(values.emailOrUsername, values.password);
      if (user) router.push("/dashboard/customer");
    } catch (error: any) {
      let description = "Invalid credentials. Please try again.";
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        description =
          "Invalid email or password. Please check your credentials and try again.";
      } else if (error.code === "auth/too-many-requests") {
        description =
          "Access to this account has been temporarily disabled due to many failed login attempts.";
      }
      toast({ variant: "destructive", title: "Login Failed", description });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword(values: z.infer<typeof forgotPasswordSchema>) {
    setIsResetting(true);
    try {
      await sendPasswordReset(values.email);
      toast({
        title: "Password Reset Email Sent",
        description: `If an account exists for ${values.email}, you will receive a reset link.`,
      });
      setIsForgotPasswordOpen(false);
      resetFP();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to send password reset email. Please try again later.",
      });
    } finally {
      setIsResetting(false);
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.form 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6" 
      noValidate
    >
      {/* ── Email field ── */}
      <motion.div variants={itemVariants} className="relative group">
        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none z-20 group-focus-within:text-indigo-500 transition-colors" />

        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("emailOrUsername")}
          placeholder=" "
          className="
            peer block w-full rounded-2xl border border-gray-200 bg-gray-50/50
            px-11 pb-3 pt-6 text-sm text-gray-900 placeholder-transparent
            outline-none ring-0
            transition-all duration-300
            focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10
          "
        />
        <label
          htmlFor="email"
          className="
            absolute left-11 top-4 z-10 origin-[0] -translate-y-3 scale-75
            text-xs font-semibold text-indigo-600
            transition-all duration-300
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400
            peer-placeholder-shown:text-sm
            peer-focus:top-4 peer-focus:-translate-y-3 peer-focus:scale-75
            peer-focus:text-indigo-600
            cursor-text
          "
        >
          Email Address
        </label>
        
        <AnimatePresence>
          {errors.emailOrUsername && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 ml-1 text-xs font-medium text-red-500 flex items-center gap-1"
            >
              <span className="w-1 h-1 rounded-full bg-red-500" />
              {errors.emailOrUsername.message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Password field ── */}
      <motion.div variants={itemVariants} className="relative group">
        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none z-20 group-focus-within:text-indigo-500 transition-colors" />

        <input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          {...register("password")}
          placeholder=" "
          className="
            peer block w-full rounded-2xl border border-gray-200 bg-gray-50/50
            px-11 pb-3 pt-6 pr-12 text-sm text-gray-900 placeholder-transparent
            outline-none ring-0
            transition-all duration-300
            focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10
          "
        />
        <label
          htmlFor="password"
          className="
            absolute left-11 top-4 z-10 origin-[0] -translate-y-3 scale-75
            text-xs font-semibold text-indigo-600
            transition-all duration-300
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400
            peer-placeholder-shown:text-sm
            peer-focus:top-4 peer-focus:-translate-y-3 peer-focus:scale-75
            peer-focus:text-indigo-600
            cursor-text
          "
        >
          Password
        </label>

        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="
            absolute right-4 top-1/2 -translate-y-1/2 z-20
            text-gray-400 hover:text-indigo-500 transition-colors p-1 rounded-lg hover:bg-indigo-50
          "
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>

        <AnimatePresence>
          {errors.password && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 ml-1 text-xs font-medium text-red-500 flex items-center gap-1"
            >
              <span className="w-1 h-1 rounded-full bg-red-500" />
              {errors.password.message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Forgot password */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="text-xs font-medium text-gray-400 hover:text-indigo-600 transition-colors"
            >
              Forgot password?
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md border-0 bg-white/90 backdrop-blur-xl shadow-2xl rounded-[32px]">
            <form onSubmit={handleSubmitFP(handleForgotPassword)} className="p-2">
              <DialogHeader className="mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-indigo-600" />
                </div>
                <DialogTitle className="text-2xl font-bold text-gray-900">Reset Password</DialogTitle>
                <DialogDescriptionComponent className="text-gray-500">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </DialogDescriptionComponent>
              </DialogHeader>
              
              <div className="relative mb-6">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
                <input
                  id="fp-email"
                  type="email"
                  {...registerFP("email")}
                  placeholder=" "
                  className="peer block w-full rounded-2xl border border-gray-100 bg-gray-50 px-11 py-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 transition-all"
                />
                <label htmlFor="fp-email" className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">Email Address</label>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <button type="button" className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                </DialogClose>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  {isResetting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send Link
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* ── Login Button ── */}
      <motion.div variants={itemVariants}>
        <button
          type="submit"
          disabled={isLoading || !emailValue || !passwordValue}
          className="
            group relative w-full overflow-hidden rounded-[18px] bg-indigo-600 py-4 text-sm font-bold text-white
            shadow-xl shadow-indigo-200 transition-all duration-300
            hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]
            disabled:opacity-50 disabled:grayscale disabled:scale-100
            flex items-center justify-center gap-2
          "
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent italic" />
          
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span>Login to Stride</span>
              <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </button>
      </motion.div>
    </motion.form>
  );
}

// Stride: Professional Financial Connectivity
