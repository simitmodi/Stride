
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { BackgroundSlideshow } from "@/components/background-slideshow";
import Image from "next/image";
import Logo from '@/lib/Logo.png';

export default function Home() {
  const slideshowImages = PlaceHolderImages.filter(p => p.id.startsWith("professional-bg"));

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <BackgroundSlideshow images={slideshowImages} />
      <div className="absolute inset-0 bg-card/75" />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4">
        <div className="group relative w-full max-w-2xl">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-75 blur-lg transition-all duration-300 group-hover:opacity-100 group-hover:blur-2xl"></div>
          <div 
            className="relative w-full rounded-xl bg-card p-8 text-center shadow-lg md:p-12 transform-gpu"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            <div className="flex flex-col items-center gap-6">
              <Image src={Logo} alt="Stride Logo" width={200} height={200} />
              <h1 className="text-balance text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl">
                Seamless Bank Appointments
              </h1>
              <p className="max-w-[600px] text-balance text-foreground md:text-xl">
                Manage your appointments quickly and efficiently.
              </p>
              <Button asChild size="lg" className="mt-4 h-12 px-8 text-base transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent hover:text-accent-foreground">
                <Link href="/login">Login / Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
