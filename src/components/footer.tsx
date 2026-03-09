'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Logo from '@/lib/Logo.png';

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("w-full py-16 bg-white border-t border-slate-100 relative z-[20]", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image src={Logo} alt="Stride Logo" width={120} height={40} className="w-auto h-8" />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Seamlessly connecting customers and bank staff to eliminate waiting and improve banking experiences.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4 tracking-tight">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>


          <div>
            <h4 className="font-bold text-slate-900 mb-4 tracking-tight">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4 tracking-tight">Connect</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="https://github.com/simitmodi/Stride" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub Repository</a></li>
              <li><Link href="/developers" className="hover:text-primary transition-colors">Meet the Team</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Stride Banking. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Social spans removed as they are now in the Connect column */}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Stride: Professional Financial Connectivity
