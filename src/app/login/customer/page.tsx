import { CustomerLoginForm } from "@/components/auth/customer-login-form";
import { AnimatedRightSide } from "@/components/auth/AnimatedRightSide";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/lib/Logo.png";

export default function CustomerLoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#F4F4F8]">
      {/* Left Column - Form */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2 lg:p-12 xl:p-24 relative z-10">
        <main className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="inline-block">
              <Image src={Logo} alt="Stride" width={140} height={42} className="mb-8 lg:mx-0 mx-auto drop-shadow-sm" />
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              Log in to your Stride account.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <CustomerLoginForm />

            <p className="mt-6 text-center text-sm text-gray-500 lg:text-left">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup/customer"
                className="font-medium text-indigo-600 underline-offset-4 hover:underline transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </main>
      </div>

      {/* Right Column - Video */}
      <AnimatedRightSide />
    </div>
  );
}
