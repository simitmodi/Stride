import Link from 'next/link';
import { Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        'z-20 w-full border-t border-border/5 p-6 shadow md:p-8',
        className
      )}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <div className="container mx-auto grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
        {/* About Section */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            About Stride
          </h3>
          <p className="text-sm text-foreground/80">
            Stride is a data-driven platform designed to simplify the process of
            banking appointments for users across India. It enables users to
            schedule appointments efficiently, provides step-by-step guidance
            on required documents, and reduces unnecessary trips to the bank.
            Users can access a personalized dashboard displaying upcoming
            visits, appointment reminders, and important notifications. Stride
            also integrates a calendar view to track all scheduled activities,
            ensuring users never miss a banking task. By connecting users with
            banks digitally, Stride streamlines the workflow for both customers
            and bank staff, making the entire process transparent, organized,
            and hassle-free. With Stride, banking becomes faster, smarter, and
            more predictable.
          </p>
        </div>

        {/* Links Section */}
        <div className="col-span-1">
          <div className="mb-4 flex items-center justify-center gap-2 md:justify-start">
            <Banknote className="h-6 w-6 text-primary" />
            <span className="self-center whitespace-nowrap text-xl font-semibold text-foreground">
              Stride
            </span>
          </div>
          <ul className="flex flex-col items-center gap-2 text-sm font-medium text-foreground md:items-start">
            <li>
              <Link
                href="#"
                className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white hover:text-black"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white hover:text-black"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white hover:text-black"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="inline-block transform rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white hover:text-black"
              >
                Meet the Team
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
