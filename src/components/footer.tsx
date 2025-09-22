import Link from "next/link";
import { Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "z-20 w-full border-t border-border/50 bg-card/5 p-4 shadow md:flex md:items-center md:justify-between md:p-6",
        className
      )}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <div className="container mx-auto flex flex-col items-center justify-between text-center md:flex-row md:text-left">
        <div className="mb-4 flex items-center gap-2 md:mb-0">
          <Banknote className="h-6 w-6 text-primary" />
          <span className="self-center whitespace-nowrap text-xl font-semibold text-foreground">
            Stride
          </span>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-foreground sm:gap-4">
          <li>
            <Link href="#" className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white hover:text-black">
              About
            </Link>
          </li>
          <li>
            <Link href="#" className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white hover:text-black">
              Features
            </Link>
          </li>
          <li>
            <Link href="#" className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white hover:text-black">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="#" className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white hover:text-black">
              Contact
            </Link>
          </li>
          <li>
            <Link href="#" className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white hover:text-black">
              Meet the Team
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
