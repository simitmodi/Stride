import { CustomerSignUpForm } from "@/components/auth/customer-signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function CustomerSignUpPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
      <Image
        src="https://picsum.photos/seed/professional-bg/1920/1080"
        alt="professional background"
        fill
        className="object-cover"
        style={{ filter: 'blur(8px)' }}
        data-ai-hint="professional background"
        priority
      />
      <div className="absolute inset-0 bg-background/60" />

      <main className="relative z-10 flex w-full max-w-md flex-col items-center">
        <Card
          className="w-full transform-gpu border-border bg-card/80 shadow-lg"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Create an Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your details below to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerSignUpForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login/customer" className="font-medium text-primary underline-offset-4 hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
