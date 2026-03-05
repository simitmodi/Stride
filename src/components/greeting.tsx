"use client";

import { useUser, useMemoFirebase } from "@/firebase/provider";
import { useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import AnimatedSplitText from "@/components/SplitText";
import { AnimatePresence, motion } from "framer-motion";

const QUIRKY_GREETINGS = [
  "Stride never sleeps",
  "Owls in motion",
  "Your financial fortress awaits",
  "Ready to conquer the ledger?",
  "Money moves only",
  "The vault is open",
  "Building wealth, one stride at a time",
  "Your future starts here",
  "Precision in every decision",
  "Calculated moves only",
  "Because your money deserves better",
  "Your financial pulse is looking strong",
  "Dawn is yours",
  "Fresh stride",
  "Rise and flow",
  "Morning momentum",
  "Night moves",
];

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
    // Pick a random quirky greeting on mount
    const randomIdx = Math.floor(Math.random() * QUIRKY_GREETINGS.length);
    setGreeting(QUIRKY_GREETINGS[randomIdx]);
  }, []);

  const firstName = userData?.firstName;
  const fullGreeting = greeting ? `${greeting}, ${firstName || "Valued Customer"}.` : "";

  return (
    <div className="text-center pt-12 pb-8 h-[120px]">
      <AnimatePresence mode="wait">
        {fullGreeting && (
          <motion.div
            key={fullGreeting}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-bold text-[#4F46E5] tracking-tight">
              {fullGreeting}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// Stride: Professional Financial Connectivity
