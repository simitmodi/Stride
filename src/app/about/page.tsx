import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Logo from '@/lib/Logo.png';

export default function AboutPage() {
  const professionalBg = PlaceHolderImages.find(
    (p) => p.id === 'professional-bg-1'
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
      <div className="absolute inset-0 bg-background/60" />

      <main className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <div className="group relative w-full">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-75 blur-lg transition-all duration-300 group-hover:opacity-100 group-hover:blur-xl"></div>
          <div
            className="relative w-full rounded-xl bg-card/15 p-8 shadow-lg md:p-12 transform-gpu"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            <div className="flex flex-col gap-6 text-foreground items-center">
              <div className="flex items-center gap-3">
                <Image src={Logo} alt="Stride Logo" width={200} height={200} />
              </div>

              <p className="text-base text-foreground/80 md:text-lg">
                Stride is a data-driven platform designed to simplify the process
                of banking appointments for users across India. It enables users
                to schedule appointments efficiently, provides step-by-step
                guidance on required documents, and reduces unnecessary trips to
                the bank. Users can access a personalized dashboard displaying
                upcoming visits, appointment reminders, and important
                notifications. Stride also integrates a calendar view to track all
                scheduled activities, ensuring users never miss a banking task. By
                connecting users with banks digitally, Stride streamlines the
                workflow for both customers and bank staff, making the entire
                process transparent, organized, and hassle-free. With Stride,
                banking becomes faster, smarter, and more predictable.
              </p>

              <ul className="mt-4 grid grid-cols-1 gap-4 text-foreground/80 md:grid-cols-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-primary">&#10003;</span>
                  <span>Personalized dashboards for individual users.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-primary">&#10003;</span>
                  <span>Real-time updates and notifications for appointments.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-primary">&#10003;</span>
                  <span>Step-by-step guidance for document preparation.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-primary">&#10003;</span>
                  <span>Calendar integration for easy planning.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-primary">&#10003;</span>
                  <span>Efficient communication between users and bank staff.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-primary">&#10003;</span>
                  <span>Data-driven suggestions to reduce waiting times.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-primary">&#10003;</span>
                  <span>Secure and reliable platform ensuring user privacy.</span>
                </li>
              </ul>
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
