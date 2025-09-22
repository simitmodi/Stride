import { BankLoginForm } from "@/components/auth/bank-login-form";
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

export default function BankLoginPage() {
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
      <div className="absolute inset-0 bg-background/60" />
      
      <main className="relative z-10 flex w-full max-w-md flex-col items-center">
        <div className="group relative w-full">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-75 blur-lg transition-all duration-300 group-hover:opacity-100 group-hover:blur-xl"></div>
          <Card 
            className="relative w-full transform-gpu bg-card/15 shadow-lg"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">Bank Portal Login</CardTitle>
              <CardDescription className="text-foreground/80">
                For authorized personnel only.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BankLoginForm />
              <p className="mt-6 text-center text-sm text-foreground/80">
                <Link href="/login" className="font-medium text-primary hover:text-accent hover:underline transition-colors">
                  Not a bank employee?
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
