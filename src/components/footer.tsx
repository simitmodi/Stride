import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Banknote } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto w-full text-foreground/80">
      <div className="container py-8">
        <Separator className="mb-8 bg-border/60" />
        <div className="flex flex-col items-center justify-between gap-6 text-sm md:flex-row">
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            <p className="font-semibold">&copy; {new Date().getFullYear()} Stride. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="#" className="transition-colors hover:text-primary">
              About
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              Contact
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              Meet the Team
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
