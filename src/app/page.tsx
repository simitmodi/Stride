
"use client";

import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const professionalBg = PlaceHolderImages.find(p => p.id === "professional-bg");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(format(now, "h:mm"));
      setDate(format(now, "EEEE, MMMM d"));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    
    // Trigger fade-in animation
    setIsLoaded(true);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
      {professionalBg && <Image
        src={professionalBg.imageUrl}
        alt={professionalBg.description}
        fill
        className="object-cover transition-all duration-1000 ease-in-out"
        style={{
            filter: 'blur(8px)',
            transform: isLoaded ? 'scale(1)' : 'scale(1.1)',
            opacity: isLoaded ? 1 : 0,
        }}
        data-ai-hint={professionalBg.imageHint}
        priority
      />}
      <div className="absolute inset-0 bg-black/30" />

      <main className={`relative z-10 flex h-full w-full flex-col items-center justify-between p-4 text-white transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top Section: Time and Date */}
        <div className="flex-shrink-0 pt-16 text-center">
          <h1 className="text-7xl font-bold tracking-tight text-white/90" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            {time}
          </h1>
          <p className="text-xl font-medium text-white/80">{date}</p>
        </div>

        {/* Center Section: Empty */}
        <div />


        {/* Bottom Section: Login Button */}
        <div className="w-full flex-shrink-0 flex justify-center pb-20 md:pb-24">
           <Button
            asChild
            size="lg"
            className="h-14 w-full max-w-xs rounded-lg border border-white/20 bg-primary text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/90 active:scale-100"
          >
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
