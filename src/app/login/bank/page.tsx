import { BankLoginForm } from "@/components/auth/bank-login-form";
import { Search, Loader2 } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import Logo from '@/lib/Logo.png';

export default function BankLoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#111111] overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-200%) skewX(-15deg); }
          100% { transform: translateX(300%) skewX(-15deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(99,102,241,0.2); border-color: rgba(255,255,255,0.05); }
          50% { box-shadow: 0 0 30px rgba(99,102,241,0.6); border-color: rgba(255,255,255,0.2); }
        }
        @keyframes width-pulse {
          0% { width: 10%; }
          50% { width: 80%; }
          100% { width: 10%; }
        }
        @keyframes width-pulse-delayed {
          0% { width: 30%; }
          50% { width: 90%; }
          100% { width: 30%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out 3s infinite; }
        .animate-shimmer { animation: shimmer 3s infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-width-pulse { animation: width-pulse 4s ease-in-out infinite; }
        .animate-width-pulse-delayed { animation: width-pulse-delayed 5s ease-in-out infinite; }
      `}</style>

      {/* ─── LEFT COLUMN: Selection (Solid Light Theme) ─── */}
      <div className="flex w-full flex-col justify-center bg-[#F4F4F8] px-6 py-12 md:w-1/2 lg:px-16 xl:px-24 rounded-r-3xl z-10 shadow-[8px_0_30px_rgba(0,0,0,0.1)] relative">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
              Bank Portal Login
            </h1>
            <p className="text-gray-500 text-lg">
              For authorized personnel only.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <BankLoginForm />
            <div className="mt-6 flex flex-col gap-2 text-center text-sm text-gray-500">
              <p>
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup/bank"
                  className="font-medium text-indigo-600 underline-offset-4 hover:underline transition-colors"
                >
                  Sign up First
                </Link>
              </p>
              <Link
                href="/login/customer"
                className="font-medium text-indigo-600 underline-offset-4 hover:underline transition-colors block text-center mt-2 pt-4 border-t border-gray-100"
              >
                Not a bank employee? Go to Customer Login
              </Link>
            </div>
          </div>

          <div className="mt-10 text-center md:text-left text-sm font-medium">
            <Link href="/login" className="text-gray-500 underline hover:text-indigo-600 transition-colors inline-flex items-center gap-1">
              &larr; Back to Login Options
            </Link>
          </div>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: Video / Animated Presentation ─── */}
      <div className="hidden md:flex md:w-1/2 bg-[#191919] relative items-center justify-center overflow-hidden">

        {/* Live Video Abstract Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-[0.15] mix-blend-screen"
          src="https://cdn.pixabay.com/video/2020/05/25/40141-424759714_large.mp4"
        />

        {/* Dark grid pattern over video */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)]"></div>

        <div className="relative z-10 w-full max-w-lg px-8 flex flex-col items-center">

          <h2
            className="text-center text-4xl lg:text-5xl tracking-tight text-[#f4f4f5] mb-4 font-medium"
            style={{ fontFamily: "Georgia, serif", lineHeight: 1.2 }}
          >
            Seamless Bank <br /> Appointments
          </h2>

          {/* Mock Floating UI Frame */}
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#27272a]/40 p-4 shadow-2xl backdrop-blur-xl animate-float animate-pulse-glow mt-8">

            {/* Header */}
            <div className="flex items-center gap-2 mb-4 bg-black/40 px-3 py-2 rounded-lg border border-white/5">
              <Search className="h-4 w-4 text-white/40" />
              <span className="text-sm font-medium text-white/40">Search available slots...</span>
            </div>

            {/* Mock Folders */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/5 transition border border-transparent hover:border-white/10 cursor-pointer">
                <div className="h-10 w-12 rounded-lg bg-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center justify-center relative overflow-hidden animate-float">
                  <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-shimmer"></div>
                </div>
                <span className="text-[11px] text-white/70">Appointments</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/5 transition border border-transparent hover:border-white/10 cursor-pointer">
                <div className="h-10 w-12 rounded-lg bg-indigo-500/80 flex items-center justify-center relative overflow-hidden animate-float-delayed">
                  <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-shimmer" style={{ animationDelay: '1.5s' }}></div>
                </div>
                <span className="text-[11px] text-white/70 text-center leading-tight">Document Checklist</span>
              </div>
            </div>

            {/* Mock Progress Bars */}
            <div className="bg-black/20 rounded-xl p-3 border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Booking Status</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
                  <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full animate-width-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full border border-indigo-400/50 bg-indigo-400/20 animate-pulse"></div>
                  <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/30 rounded-full animate-width-pulse-delayed"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Glow effect at cursor / bottom */}
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[100px]"></div>
        <div className="absolute top-20 -right-20 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[80px]"></div>
      </div>
    </div>
  );
}
