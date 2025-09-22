"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(format(now, "h:mm a"));
      setDate(format(now, "EEEE, MMMM d"));
    }, 1000);

    // Set initial time and date to avoid flash of empty content
    const now = new Date();
    setTime(format(now, "h:mm a"));
    setDate(format(now, "EEEE, MMMM d"));

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <Image
        src="https://picsum.photos/seed/stride-bg/1920/1080"
        alt="Abstract background"
        fill
        className="object-cover blur-sm scale-105"
        data-ai-hint="abstract background"
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex h-full w-full flex-col items-center text-white">
        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter">
            {time}
          </h1>
          <p className="text-lg md:text-xl font-medium">{date}</p>
        </div>

        <div className="w-full flex justify-center px-4 pb-20 md:pb-24">
           <Button
            asChild
            size="lg"
            className="w-full max-w-sm h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-lg font-semibold shadow-lg transition-all duration-300 hover:bg-white/30 hover:scale-105 active:scale-100"
          >
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
