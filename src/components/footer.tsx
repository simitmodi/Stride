import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="w-full mt-auto">
      <Separator />
      <div className="container mx-auto py-6 px-4 md:px-6 flex items-center justify-between text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Stride. All rights reserved.</p>
        <Link href="#" className="hover:text-primary transition-colors">
          Meet Our Developers
        </Link>
      </div>
    </footer>
  );
}
