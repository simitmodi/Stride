import { Button } from "@/components/ui/button";
import { Banknote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const professionalBg = PlaceHolderImages.find(p => p.id === "professional-bg-new");

  return (
    <div className="relative flex min-h-screen w-full flex-col">
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

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4">
        <div 
          className="w-full max-w-2xl rounded-xl border border-border bg-card/80 p-8 text-center shadow-lg md:p-12"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <Banknote className="h-10 w-10 text-primary" />
              <span className="text-4xl font-bold text-foreground">Stride</span>
            </div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl">
              Seamless Bank Appointments
            </h1>
            <p className="max-w-[600px] text-balance text-muted-foreground md:text-xl">
              Manage your appointments quickly and efficiently.
            </p>
            <Button asChild size="lg" className="mt-4 h-12 px-8 text-base">
              <Link href="/login">Login / Get Started</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
