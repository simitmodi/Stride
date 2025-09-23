import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, User, Banknote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/lib/Logo.png';

export default function LoginOptionsPage() {
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

      <main className="relative z-10 flex w-full max-w-lg flex-col items-center">
        <div className="group relative w-full">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-75 blur-lg transition-all duration-300 group-hover:opacity-100 group-hover:blur-xl"></div>
          <div
            className="relative w-full rounded-xl bg-card/15 p-8 shadow-lg transform-gpu"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            <div className="text-center text-foreground">
              <Image src={Logo} alt="Stride Logo" width={48} height={48} className="mb-4 inline-block" />
              <h1 className="text-3xl font-bold">Select your login type</h1>
              <p className="mt-2 text-foreground">
                Choose your role to continue.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              <Link href="/login/customer" className="group">
                <Card className="transform-gpu border-border bg-background/50 text-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-100">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <User className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <CardTitle className="text-foreground">Customer Login</CardTitle>
                      <CardDescription className="group-hover:text-accent-foreground">
                        Access your personal account.
                      </CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-accent-foreground" />
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/login/bank" className="group">
                <Card className="transform-gpu border-border bg-background/50 text-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-100">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Banknote className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <CardTitle className="text-foreground">Bank Login</CardTitle>
                      <CardDescription className="group-hover:text-accent-foreground">
                        Access the employee portal.
                      </CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-accent-foreground" />
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-foreground/80">
          <Link href="/" className="underline hover:text-primary">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
