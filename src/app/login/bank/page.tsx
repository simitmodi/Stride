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
        <Card 
          className="w-full transform-gpu border-border bg-card/80 shadow-lg"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Bank Portal Login</CardTitle>
            <CardDescription className="text-muted-foreground">
              For authorized personnel only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BankLoginForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link href="/login" className="font-medium text-primary hover:underline">
                Not a bank employee?
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
