import { CustomerLoginForm } from "@/components/auth/customer-login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function CustomerLoginPage() {
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

      <main className="relative z-10 flex w-full max-w-md flex-col items-center">
        <Card 
          className="w-full transform-gpu border-white/20 bg-white/10 text-white shadow-2xl"
          style={{ backdropFilter: 'blur(32px)' }}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Customer Login</CardTitle>
            <CardDescription className="text-white/70">
              Welcome back! Please enter your details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerLoginForm />
            <p className="mt-6 text-center text-sm text-white/70">
              Don't have an account?{" "}
              <Link href="/signup/customer" className="font-medium text-white underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
