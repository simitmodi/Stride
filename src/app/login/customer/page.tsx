import { CustomerLoginForm } from "@/components/auth/customer-login-form";
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
      <div className="relative hidden w-full bg-slate-900 lg:block lg:w-1/2 overflow-hidden shadow-2xl">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connection-background-19014-large.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-1516-large.mp4" type="video/mp4" />
        </video>
        {/* Overlay gradient for text readability and sleekness */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-16 left-16 right-16 z-10 text-white">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Welcome to Stride
          </h2>
          <p className="mt-4 text-slate-300 text-xl font-light">
            Deploy, scale, and manage your infrastructure effortlessly with our next-generation platform.
          </p>
        </div>
      </div>
    </div>
  );
}
