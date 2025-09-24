
import { CustomerLoginForm } from "@/components/auth/customer-login-form";
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

export default function CustomerLoginPage() {
  const professionalBg = PlaceHolderImages.find(p => p.id === "professional-bg-new");

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
      {professionalBg && <Image
        src={professionalBg.imageUrl}
        alt={professionalBg.description}
        fill
        className="object-cover"
        style={{ filter: 'blur(8px)' }}
        data-ai-hint={professionalBg.imageHint}
        priority
      />}
      <div className="absolute inset-0 bg-card/75" />

      <main className="relative z-10 flex w-full max-w-md flex-col items-center">
        <div className="group relative w-full">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-75 blur-lg transition-all duration-300 group-hover:opacity-100 group-hover:blur-2xl"></div>
          <Card 
            className="relative w-full transform-gpu bg-card shadow-lg"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">Customer Login</CardTitle>
              <CardDescription className="text-foreground/80">
                Welcome back! Please enter your details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerLoginForm />
              <p className="mt-6 text-center text-sm text-foreground/80">
                Don't have an account?{" "}
                <Link href="/signup/customer" className="font-medium text-primary underline-offset-4 hover:text-accent hover:underline transition-colors">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
