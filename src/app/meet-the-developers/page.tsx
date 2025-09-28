
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Users, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function MeetTheDevelopersPage() {
  const professionalBg = PlaceHolderImages.find(
    (p) => p.id === 'professional-bg-7'
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
      {professionalBg && (
        <Image
          src={professionalBg.imageUrl}
          alt={professionalBg.description}
          fill
          className="object-cover"
          style={{ filter: 'blur(8px)' }}
          data-ai-hint={professionalBg.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-card/75" />

      <main className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="group relative w-full">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-75 blur-lg transition-all duration-500 group-hover:opacity-100 group-hover:blur-2xl"></div>
          <div
            className="relative w-full rounded-xl bg-card p-8 text-center shadow-lg md:p-12"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            <div className="flex flex-col items-center gap-6">
                <Users className="h-16 w-16 text-primary" />
              <h1 className="text-balance text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl">
                Meet The Developers
              </h1>
              <p className="max-w-[600px] text-balance text-foreground md:text-xl">
                This page is under construction. Come back soon to meet the talented team behind Stride!
              </p>
            </div>
          </div>
        </div>

         <div className="mt-8">
          <Button asChild variant="outline" size="icon" className="h-12 w-12 bg-card/5">
            <Link href="/">
              <Home className="h-6 w-6" />
              <span className="sr-only">Back to Home</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
