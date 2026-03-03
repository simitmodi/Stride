
import { CustomerSignUpForm } from "@/components/auth/customer-signup-form";
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

export default function CustomerSignUpPage() {
  const professionalBg = PlaceHolderImages.find(p => p.id === "professional-bg-new");

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4" style={{ backgroundColor: "#F4F4F8" }}>

      <main className="relative z-10 flex w-full max-w-md flex-col items-center">
        <div className="group relative w-full">
          {/* Form static simple card block */}
          <Card className="w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
            <CardHeader className="text-center pt-6">
              <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">Create an Account</CardTitle>
              <CardDescription className="text-gray-500 font-light mt-2 text-sm">
                Enter your details below to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerSignUpForm />
              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login/customer" className="font-medium text-indigo-600 underline-offset-4 hover:underline transition-colors">
                  Log in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
