
import { CustomerLoginForm } from "@/components/auth/customer-login-form";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";

export default function CustomerLoginPage() {
  const professionalBg = PlaceHolderImages.find(p => p.id === "professional-bg-new");

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4" style={{ backgroundColor: "#F4F4F8" }}>

      <main className="relative z-10 flex w-full max-w-md flex-col items-center">
        <div className="w-full">
          {/* Login card */}
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Customer Login
              </h1>
              <p className="mt-2 text-sm font-light text-gray-500">
                Welcome back!
              </p>
            </div>

            <CustomerLoginForm />

            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup/customer"
                className="font-medium text-indigo-600 underline-offset-4 hover:underline transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
