import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Banknote, Menu } from "lucide-react";
import Footer from "@/components/footer";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-calendar");
  const professionalBg = PlaceHolderImages.find(p => p.id === "professional-bg-new");

  const navLinks = [
    { href: "#", label: "About" },
    { href: "#", label: "Features" },
    { href: "#", label: "Developers" },
    { href: "#", label: "Contact" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {professionalBg && <Image
        src={professionalBg.imageUrl}
        alt={professionalBg.description}
        fill
        className="object-cover"
        style={{ filter: 'brightness(0.9)' }}
        data-ai-hint={professionalBg.imageHint}
        priority
      />}
      <div className="absolute inset-0 bg-background/80" />

      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
            <Banknote className="h-6 w-6 text-primary" />
            <span className="text-lg">Stride</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto md:hidden">
                <Menu />
                <span className="sr-only">Toggle Navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
                  <Banknote className="h-6 w-6 text-primary" />
                  <span className="text-lg">Stride</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <section className="container grid min-h-[calc(100vh-10rem)] items-center gap-12 px-4 py-12 md:grid-cols-2 lg:gap-20">
          <div className="flex flex-col items-start space-y-6">
            <h1 className="text-balance text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl lg:text-6xl">
              Stride — Seamless Bank Appointments
            </h1>
            <p className="max-w-[600px] text-balance text-muted-foreground md:text-xl">
              Book appointments, manage visits, and stay organized effortlessly.
            </p>
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/login">Login / Get Started</Link>
            </Button>
          </div>
          <div className="flex justify-center">
            {heroImage && (
              <div className="transform-gpu rounded-xl bg-white/10 p-4 shadow-2xl ring-1 ring-white/20 backdrop-blur-lg transition-all hover:scale-[1.02]">
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
