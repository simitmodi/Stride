
"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScrollingDatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date) => void;
}

export function ScrollingDatePicker({ date, onDateChange }: ScrollingDatePickerProps) {
  const [day, setDay] = React.useState<number | undefined>(date?.getDate());
  const [month, setMonth] = React.useState<number | undefined>(date?.getMonth());
  const [year, setYear] = React.useState<number | undefined>(date?.getFullYear());

  const handleDateChange = (part: "day" | "month" | "year", value: number) => {
    const newDay = part === "day" ? value : day || 1;
    const newMonth = part === "month" ? value : month || 0;
    const newYear = part === "year" ? value : year || new Date().getFullYear();

    let date = new Date(newYear, newMonth, newDay);
    
    // Adjust day if it's out of bounds for the new month/year
    if (date.getMonth() !== newMonth) {
      date = new Date(newYear, newMonth + 1, 0);
    }
    
    setDay(date.getDate());
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    onDateChange(date);
  };
  
  const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));
  const daysInMonth = (year && month !== undefined) ? new Date(year, month + 1, 0).getDate() : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  React.useEffect(() => {
    if(date){
        setDay(date.getDate());
        setMonth(date.getMonth());
        setYear(date.getFullYear());
    }
  }, [date]);

  return (
    <div className="flex justify-between gap-3">
      {/* Day Selector */}
      <Select
        value={day?.toString()}
        onValueChange={(v) => handleDateChange("day", parseInt(v, 10))}
        disabled={month === undefined || year === undefined}
      >
        <SelectTrigger aria-label="Day">
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {days.map((d) => (
            <SelectItem key={d} value={d.toString()}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Month Selector */}
      <Select
        value={month?.toString()}
        onValueChange={(v) => handleDateChange("month", parseInt(v, 10))}
      >
        <SelectTrigger aria-label="Month">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value.toString()}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year Selector */}
      <Select
        value={year?.toString()}
        onValueChange={(v) => handleDateChange("year", parseInt(v, 10))}
      >
        <SelectTrigger aria-label="Year">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
