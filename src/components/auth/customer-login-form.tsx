
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail, sendPasswordReset } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* ── Email field with floating label ── */}
      <div className="relative">
        {/* Icon */}
        <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />

        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("emailOrUsername")}
          placeholder=" "
          className="
            peer block w-full rounded-xl border border-gray-200 bg-white
            px-10 pb-2.5 pt-5 text-sm text-gray-900 placeholder-transparent
            outline-none ring-0
            transition-all duration-200
            focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50
          "
        />
        <label
          htmlFor="email"
          className="
            absolute left-10 top-4 z-10 origin-[0] -translate-y-2.5 scale-75
            text-xs font-medium text-indigo-600
            transition-all duration-200
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400
            peer-placeholder-shown:text-sm
            peer-focus:top-4 peer-focus:-translate-y-2.5 peer-focus:scale-75
            peer-focus:text-indigo-600
            cursor-text
          "
        >
          Email
        </label>
        {errors.emailOrUsername && (
          <p className="mt-1.5 text-xs text-red-400">
            {errors.emailOrUsername.message}
          </p>
        )}
      </div>

      {/* ── Password field with floating label + eye toggle ── */}
      <div className="relative">
        {/* Lock icon */}
        <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />

        <input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          {...register("password")}
          placeholder=" "
          className="
            peer block w-full rounded-xl border border-gray-200 bg-white
            px-10 pb-2.5 pt-5 pr-11 text-sm text-gray-900 placeholder-transparent
            outline-none ring-0
            transition-all duration-200
            focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50
          "
        />
        <label
          htmlFor="password"
          className="
            absolute left-10 top-4 z-10 origin-[0] -translate-y-2.5 scale-75
            text-xs font-medium text-indigo-600
            transition-all duration-200
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400
            peer-placeholder-shown:text-sm
            peer-focus:top-4 peer-focus:-translate-y-2.5 peer-focus:scale-75
            peer-focus:text-indigo-600
            cursor-text
          "
        >
          Password
        </label>

        {/* Eye toggle */}
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="
            absolute right-3.5 top-1/2 -translate-y-1/2 z-10
            text-gray-400 hover:text-indigo-500 transition-colors
          "
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>

        {errors.password && (
          <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* Forgot password */}
      <div className="flex justify-end">
        <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-indigo-500 transition-colors"
            >
              Forgot password?
            </button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[425px] border border-white/20 text-white"
            style={{
              background: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(20px)",
            }}
          >
            <form onSubmit={handleSubmitFP(handleForgotPassword)}>
              <DialogHeader>
                <DialogTitle className="text-teal-300">Reset Password</DialogTitle>
                <DialogDescriptionComponent className="text-white/60">
                  Enter your email address and we&apos;ll send you a reset link.
                </DialogDescriptionComponent>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 pointer-events-none z-10" />
                  <input
                    id="fp-email"
                    type="email"
                    {...registerFP("email")}
                    placeholder=" "
                    className="
                      peer block w-full rounded-xl border border-white/20 bg-white/10
                      px-10 pb-2.5 pt-5 text-sm text-white placeholder-transparent
                      outline-none focus:border-teal-400/70 focus:ring-1 focus:ring-teal-400/50
                    "
                  />
                  <label
                    htmlFor="fp-email"
                    className="
                      absolute left-10 top-4 z-10 origin-[0] -translate-y-2.5 scale-75
                      text-xs font-medium text-teal-300
                      transition-all duration-200
                      peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                      peer-placeholder-shown:scale-100 peer-placeholder-shown:text-white/50
                      peer-placeholder-shown:text-sm
                      peer-focus:top-4 peer-focus:-translate-y-2.5 peer-focus:scale-75
                      peer-focus:text-teal-300
                    "
                  >
                    Email
                  </label>
                  {errorsFP.email && (
                    <p className="mt-1.5 text-xs text-red-400">{errorsFP.email.message}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </DialogClose>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 hover:from-teal-400 hover:to-cyan-300 disabled:opacity-60 transition-all"
                >
                  {isResetting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Send Reset Link
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Gradient Login Button ── */}
      <button
        type="submit"
        disabled={isLoading}
        className="
          relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white
          shadow-md transition-all duration-300
          hover:opacity-90 hover:scale-[1.02]
          active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
          flex items-center justify-center gap-2
        "
        style={{ backgroundColor: "#4F46E5" }}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        Login
      </button>
    </form>
  );
}
