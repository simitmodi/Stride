import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Banknote } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 w-full mt-auto bg-background/80 backdrop-blur-lg">
      <div className="container py-8">
        <Separator className="mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            <p className="font-semibold">&copy; {new Date().getFullYear()} Stride. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Meet the Team
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
