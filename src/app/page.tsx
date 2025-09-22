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
        <section className="container grid items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-24 lg:gap-12">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Stride — Seamless Bank Appointments
            </h1>
            <p className="mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Manage your appointments with ease. Book, reschedule, and get reminders all in one place.
            </p>
            <Button asChild size="lg" className="mt-6">
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
