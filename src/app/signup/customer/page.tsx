
import { CustomerSignUpForm } from "@/components/auth/customer-signup-form";
import { AnimatedRightSide } from "@/components/auth/AnimatedRightSide";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/lib/Logo.png";

export default function CustomerSignUpPage() {
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
              Think fast,<br />build faster
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              Create your account to get started.
            </p>
          </div>

          <Card className="w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
            <CardHeader className="text-center pt-6 lg:text-left">
              <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">Create an Account</CardTitle>
              <CardDescription className="text-gray-500 font-light mt-2 text-sm">
                Enter your details below to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerSignUpForm />
              <p className="mt-6 text-center text-sm text-gray-500 lg:text-left">
                Already have an account?{" "}
                <Link href="/login/customer" className="font-medium text-indigo-600 underline-offset-4 hover:underline transition-colors">
                  Log in
                </Link>
              </p>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Right Column - Video */}
      <AnimatedRightSide />
    </div>
  );
}
