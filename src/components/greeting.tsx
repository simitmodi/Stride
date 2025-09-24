"use client";

import { useUser } from "@/firebase/provider";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";

const greetings = {
  0: "Good Midnight",
  2: "Peaceful Night",
  4: "Good Early Morning",
  6: "Good Morning",
  8: "A Bright Morning to You",
  10: "Late Morning Greetings",
  12: "Good Afternoon",
  14: "Hope Your Afternoon’s Going Well",
  16: "Good Evening",
  18: "Warm Evening Greetings",
  20: "Good Night",
  22: "Late Night Greetings",
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
      const userDocRef = doc(db, "users", user.uid);
      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setFirstName(docSnap.data().firstName);
          } else {
            const displayName = user.displayName;
            if (displayName) {
              setFirstName(displayName.split(" ")[0]);
            }
          }
        })
        .catch(() => {
          const displayName = user.displayName;
          if (displayName) {
            setFirstName(displayName.split(" ")[0]);
          }
        });
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
