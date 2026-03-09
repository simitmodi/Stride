import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { parse, isAfter, startOfDay } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses appointment time strings like "10:00 AM - 10:30 AM" 
 * and checks if the appointment is still upcoming.
 * @param date The date of the appointment
 * @param timeStr The time range string (e.g., "11:00 AM - 11:30 AM")
 * @returns boolean
 */
export function isAppointmentUpcoming(date: Date, timeStr: string): boolean {
  const now = new Date();
  const appointmentDate = startOfDay(date);
  const today = startOfDay(now);

  // If it's a future day, it's definitely upcoming
  if (isAfter(appointmentDate, today)) {
    return true;
  }

  // If it's a past day, it's definitely not upcoming
  if (isAfter(today, appointmentDate)) {
    return false;
  }

  // If it's today, we need to check the end time of the slot
  try {
    // Format: "11:00 AM - 11:30 AM" -> extract "11:30 AM"
    const parts = timeStr.split(" - ");
    const endTimeStr = parts[parts.length - 1].trim();
    
    // Parse the end time into a date object for today
    const parsedEndTime = parse(endTimeStr, "hh:mm a", now);
    
    return isAfter(parsedEndTime, now);
  } catch (err) {
    console.error("Error parsing appointment time:", err);
    // Fallback: if we can't parse the time but it's today, assume it's upcoming for safety
    return true;
  }
}

// Stride: Professional Financial Connectivity
