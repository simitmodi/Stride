"use client";

import { useUser } from "@/firebase/provider";
import { useEffect, useState } from "react";

const greetings = {
  0: "Stride never sleeps",
  2: "Owls in motion",
  4: "Dawn is yours",
  6: "Fresh stride",
  8: "Rise and flow",
  10: "Morning momentum",
  12: "High noon stride",
  14: "Smooth afternoon",
  16: "Golden hour stride",
  18: "Evening energy",
  20: "Night moves",
  22: "Almost midnight stride",
};

const getGreeting = () => {
  const hour = new Date().getHours();
  const key = Math.floor(hour / 2) * 2;
  return greetings[key as keyof typeof greetings];
};

export default function Greeting() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
        const displayName = user.displayName;
        if (displayName) {
          setFirstName(displayName.split(" ")[0]);
        }
    }
  }, [user]);

  return (
    <div className="text-center py-8">
      <h1 className="text-4xl font-bold text-primary">
        {greeting}, {firstName || "Valued Customer"}.
      </h1>
    </div>
  );
}