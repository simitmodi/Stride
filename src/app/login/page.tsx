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
      <AnimatedRightSide />
    </div>
  );
}
