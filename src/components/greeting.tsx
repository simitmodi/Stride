"use client";

import { useUser, useMemoFirebase } from "@/firebase/provider";
import { useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import AnimatedSplitText from "@/components/SplitText";

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
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [user, firestore]
  );
  
  const { data: userData } = useDoc(userDocRef);

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const firstName = userData?.firstName;
  const fullGreeting = `${greeting}, ${firstName || "Valued Customer"}.`;

  return (
    <div className="text-center py-8">
      <AnimatedSplitText
        key={fullGreeting}
        text={fullGreeting}
        className="text-4xl font-bold text-primary"
        tag="h1"
      />
    </div>
  );
}