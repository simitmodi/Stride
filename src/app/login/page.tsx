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

export default function LoginOptionsPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#111111] overflow-hidden">

      {/* ─── LEFT COLUMN: Selection (Solid Light Theme) ─── */}
      <div className="flex w-full flex-col justify-center bg-[#F4F4F8] px-6 py-12 md:w-1/2 lg:px-16 xl:px-24 rounded-r-3xl z-10 shadow-[8px_0_30px_rgba(0,0,0,0.1)] relative">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <Image
              src={Logo}
              alt="Stride Logo"
              width={180}
              height={180}
              className="mb-6 mx-auto md:mx-0 inline-block"
            />
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
              Welcome to Stride
            </h1>
            <p className="text-gray-500 text-lg">
              Choose your role to continue.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <Link href="/login/customer" className="group block">
              <Card className="border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 ring-1 ring-gray-200 hover:ring-indigo-300">
                <CardHeader className="flex flex-row items-center gap-4 p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    <User className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-900">Customer Login</CardTitle>
                    <CardDescription className="mt-1.5 text-sm text-gray-500">
                      Access your personal account securely.
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-6 w-6 shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-600" />
                </CardHeader>
              </Card>
            </Link>

            <Link href="/login/bank" className="group block">
              <Card className="border-0 shadow-sm bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 ring-1 ring-gray-200 hover:ring-indigo-300">
                <CardHeader className="flex flex-row items-center gap-4 p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    <Banknote className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-900">Bank Login</CardTitle>
                    <CardDescription className="mt-1.5 text-sm text-gray-500">
                      Access the employee & ops portal.
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-6 w-6 shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-600" />
                </CardHeader>
              </Card>
            </Link>
          </div>

          <div className="mt-10 text-center md:text-left text-sm font-medium">
            <Link href="/" className="text-gray-500 underline hover:text-indigo-600 transition-colors inline-flex items-center gap-1">
              &larr; Back to Home
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
            Think fast,<br /> build faster
          </h2>
          <p className="text-[#a1a1aa] text-lg text-center mb-12" style={{ fontFamily: "Georgia, serif" }}>
            Brainstorm with Stride, build intuitively
          </p>

          {/* Mock Floating UI Frame */}
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#27272a]/40 p-4 shadow-2xl backdrop-blur-xl animate-[pulse_6s_ease-in-out_infinite]">

            {/* Header */}
            <div className="flex items-center gap-2 mb-4 bg-black/40 px-3 py-2 rounded-lg border border-white/5">
              <Search className="h-4 w-4 text-white/40" />
              <span className="text-sm font-medium text-white/40">Search</span>
            </div>

            {/* Mock Folders */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/5 transition border border-transparent hover:border-white/10 cursor-pointer">
                <div className="h-10 w-12 rounded-lg bg-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-white/20 skew-x-12 translate-x-2"></div>
                </div>
                <span className="text-[11px] text-white/70">Analysis</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/5 transition border border-transparent hover:border-white/10 cursor-pointer">
                <div className="h-10 w-12 rounded-lg bg-indigo-500/80 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-white/20 skew-x-12 translate-x-2"></div>
                </div>
                <span className="text-[11px] text-white/70 text-center leading-tight">Meeting Transcripts</span>
              </div>
            </div>

            {/* Mock Progress Bars */}
            <div className="bg-black/20 rounded-xl p-3 border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Progress</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
                  <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-indigo-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full border border-indigo-400/50 bg-indigo-400/20"></div>
                  <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-white/30 rounded-full"></div>
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
