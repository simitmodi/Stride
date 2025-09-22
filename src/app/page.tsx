import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Banknote } from "lucide-react";
import Footer from "@/components/footer";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-calendar");
  const professionalBg = PlaceHolderImages.find(p => p.id === "professional-bg-new");

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {professionalBg && <Image
        src={professionalBg.imageUrl}
        alt={professionalBg.description}
        fill
        className="object-cover"
        style={{ filter: 'blur(8px) brightness(0.9)' }}
        data-ai-hint={professionalBg.imageHint}
        priority
      />}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/20 to-black/10 backdrop-blur-sm" />

      <header className="sticky top-0 z-40 w-full bg-transparent">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-white">
            <Banknote className="h-6 w-6 text-white" />
            <span className="text-lg">Stride</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center">
        <section className="container grid w-full flex-1 items-center gap-8 px-4 py-12 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1 className="text-balance text-4xl font-extrabold tracking-tighter text-white sm:text-5xl lg:text-6xl">
              Stride — Seamless Bank Appointments
            </h1>
            <p className="mt-4 max-w-[600px] text-balance text-gray-200 md:text-lg">
              Manage your appointments with ease. Book, reschedule, and get reminders all in one place.
            </p>
            <Button asChild size="lg" className="mt-6 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500">
              <Link href="/login">Login / Get Started</Link>
            </Button>
          </div>
          <div className="flex justify-center">
            {heroImage && (
              <div className="transform-gpu rounded-xl bg-white/20 p-4 shadow-2xl ring-1 ring-white/30 backdrop-blur-lg transition-all hover:scale-[1.02] hover:shadow-blue-500/20">
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={500}
                  height={500}
                  className="rounded-lg object-cover"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
