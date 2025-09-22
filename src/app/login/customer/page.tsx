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
  const professionalBg = PlaceHolderImages.find(p => p.id === "professional-bg");

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
      <div className="absolute inset-0 bg-background/60" />

      <main className="relative z-10 flex w-full max-w-md flex-col items-center">
        <Card 
          className="w-full transform-gpu border-border bg-card/80 shadow-lg"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Customer Login</CardTitle>
            <CardDescription className="text-muted-foreground">
              Welcome back! Please enter your details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerLoginForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup/customer" className="font-medium text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
