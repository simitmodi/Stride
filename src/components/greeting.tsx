"use client";

import { useUser, useMemoFirebase } from "@/firebase/provider";
import { useEffect, useState, useMemo } from "react";
import { doc, collection, query, where, getDocs } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import { format, startOfDay } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Sparkles } from "lucide-react";
import { isAppointmentUpcoming } from "@/lib/utils";

export default function Greeting() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [user, firestore]
  );

  const { data: userData } = useDoc(userDocRef);
  const [upcomingCount, setUpcomingCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || !userData?.appointmentIds || userData.appointmentIds.length === 0) {
        setUpcomingCount(0);
        return;
      }
      try {
        const q = query(
          collection(firestore, "appointments"),
          where("__name__", "in", userData.appointmentIds)
        );
        const snap = await getDocs(q);
        const today = startOfDay(new Date());
        let count = 0;
        snap.forEach(d => {
          const data = d.data();
          if (data.date?.toDate && !data.deleted) {
            if (isAppointmentUpcoming(data.date.toDate(), data.time)) {
              count++;
            }
          }
        });
        setUpcomingCount(count);
      } catch (err) {
        console.error("Error fetching stats for greeting:", err);
        setUpcomingCount(0);
      }
    };
    fetchStats();
  }, [user, userData, firestore]);

  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) return "Working late?";
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const firstName = userData?.firstName;
  const dateStr = format(new Date(), "EEEE, MMMM do");

  return (
    <div className="px-4 md:px-8 pt-10 pb-6 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Active Pulse
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
            {timeGreeting}{timeGreeting.endsWith('?') ? ' ' : ', '}<span className="text-indigo-600">{firstName || "Valued Customer"}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-400" />
            {dateStr}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          {upcomingCount !== null && (
            <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-4">
              <div className="bg-indigo-50 p-2 rounded-xl">
                <Sparkles className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Next Action</p>
                <p className="text-sm font-bold text-slate-700">
                  {upcomingCount > 0 
                    ? `${upcomingCount} upcoming appointment${upcomingCount > 1 ? 's' : ''}`
                    : "Schedule is clear"
                  }
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
