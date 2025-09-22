import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Banknote, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginOptionsPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black p-4">
      <Image
        src="https://picsum.photos/seed/macos-bg/1920/1080"
        alt="macOS-style wallpaper"
        fill
        className="object-cover"
        style={{ filter: 'blur(16px)' }}
        data-ai-hint="abstract background"
        priority
      />
      <div className="absolute inset-0 bg-black/30" />

      <main className="relative z-10 flex w-full max-w-lg flex-col items-center">
        <div
          className="w-full rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl"
          style={{ backdropFilter: 'blur(32px)' }}
        >
          <div className="text-center text-white">
            <Banknote className="mb-4 inline-block h-12 w-12 text-white/90" />
            <h1 className="text-3xl font-bold">Select your login type</h1>
            <p className="mt-2 text-white/70">
              Choose your role to continue.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <Link href="/login/customer" className="group">
              <Card className="transform-gpu border-white/20 bg-white/10 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-100">
                <CardHeader className="flex flex-row items-center gap-4">
                  <User className="h-8 w-8 text-white/90" />
                  <div className="flex-1">
                    <CardTitle className="text-white">Customer Login</CardTitle>
                    <CardDescription className="text-white/70">
                      Access your personal account.
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/50 transition-colors group-hover:text-white" />
                </CardHeader>
              </Card>
            </Link>
            <Link href="/login/bank" className="group">
              <Card className="transform-gpu border-white/20 bg-white/10 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-100">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Banknote className="h-8 w-8 text-white/90" />
                  <div className="flex-1">
                    <CardTitle className="text-white">Bank Login</CardTitle>
                    <CardDescription className="text-white/70">
                      Access the employee portal.
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/50 transition-colors group-hover:text-white" />
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-white/70">
          <Link href="/" className="underline hover:text-white">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
