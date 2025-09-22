import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Banknote } from "lucide-react";
import Footer from "@/components/footer";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-calendar");

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Banknote className="h-6 w-6 text-primary" />
            <span className="text-lg">Stride</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              Stride — Seamless Bank Appointments
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Manage your appointments with ease. Book, reschedule, and get reminders all in one place.
            </p>
            <Button asChild size="lg">
              <Link href="/login">Login / Get Started</Link>
            </Button>
          </div>
          <div className="flex justify-center">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={500}
                height={500}
                className="rounded-lg object-cover shadow-lg"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
