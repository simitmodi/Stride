import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Footer from '@/components/footer';
import { Banknote } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
           <Banknote className="inline-block h-16 w-16 text-primary" />
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            Welcome to Stride
          </h1>
          <p className="max-w-xl mx-auto text-lg text-muted-foreground">
            Seamlessly connecting customers and banks with trust and reliability at the core.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
