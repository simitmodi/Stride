'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Logo from '@/lib/Logo.png';

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        'z-20 w-full border-t bg-card p-6 shadow md:p-8',
        className
      )}
    >
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:gap-8">
          <div className="flex items-center gap-2 text-foreground">
            <Link href="/">
              <Image src={Logo} alt="Stride Logo" width={100} height={100} />
            </Link>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-foreground">
            <li>
              <Link
                href="/about"
                className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent hover:text-accent-foreground"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent hover:text-accent-foreground"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent hover:text-accent-foreground"
              >
                T&amp;C
              </Link>
            </li>
             <li>
              <Link
                href="/faq"
                className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent hover:text-accent-foreground"
              >
                FAQs
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent hover:text-accent-foreground"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent hover:text-accent-foreground"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
