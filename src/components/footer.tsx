import Link from "next/link";
import { Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "z-20 w-full p-4 bg-card/80 border-t border-border shadow md:flex md:items-center md:justify-between md:p-6",
        className
      )}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Banknote className="h-6 w-6 text-primary" />
          <span className="self-center text-xl font-semibold whitespace-nowrap text-foreground">
            Stride
          </span>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground sm:gap-6">
          <li>
            <Link href="#" className="hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              Features
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              Contact
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              Meet the Team
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
