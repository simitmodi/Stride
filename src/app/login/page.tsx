
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, User, Banknote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/lib/Logo.png';

export default function LoginOptionsPage() {
  const professionalBg = PlaceHolderImages.find(p => p.id === "professional-bg-new");

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#F4F4F8] p-4">
      <main className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="w-full">
          <div
            className="relative w-full rounded-2xl border border-gray-200 bg-white p-10 shadow-lg"
          >
            <div className="text-center text-slate-900">
              <Image src={Logo} alt="Stride Logo" width={200} height={200} className="mb-4 inline-block" />
              <p className="mt-2 text-slate-600">
                Choose your role to continue.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Link href="/login/customer" className="group">
                <Card className="h-full border border-gray-200 bg-white transition-all duration-300 ease-in-out hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-gray-900 text-lg">Customer Login</CardTitle>
                      <CardDescription className="text-sm text-gray-500 mt-1">
                        Access your personal account.
                      </CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-600" />
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/login/bank" className="group">
                <Card className="h-full border border-gray-200 bg-white transition-all duration-300 ease-in-out hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <Banknote className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-gray-900 text-lg">Bank Login</CardTitle>
                      <CardDescription className="text-sm text-gray-500 mt-1">
                        Access the employee portal.
                      </CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-600" />
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm">
          <Link href="/" className="text-gray-500 underline hover:text-indigo-600 transition-colors">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
