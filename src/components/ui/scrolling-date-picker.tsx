
"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i)
const days = range(1, 31);
const months = range(0, 11).map(m => new Date(2000, m).toLocaleString('default', { month: 'short' }));
const currentYear = new Date().getFullYear();
const years = range(currentYear - 100, currentYear);

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

interface ScrollPickerProps {
  items: (string | number)[];
  value: string | number;
  onValueChange: (value: string | number) => void;
  label: string;
}

const ScrollPicker: React.FC<ScrollPickerProps> = ({ items, value, onValueChange, label }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: 'y',
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
  }, [WheelGesturesPlugin()]);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  React.useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        const selectedIndex = emblaApi.selectedScrollSnap();
        onValueChange(items[selectedIndex]);
      };
      emblaApi.on("select", onSelect);
      
      const initialIndex = items.indexOf(value);
      if (initialIndex !== -1) {
        emblaApi.scrollTo(initialIndex, true);
      }
      return () => { emblaApi.off("select", onSelect) };
    }
  }, [emblaApi, items, onValueChange]);

  // Update scroll position when value changes externally
  React.useEffect(() => {
    if (emblaApi) {
        const targetIndex = items.indexOf(value);
        if(targetIndex !== -1 && targetIndex !== emblaApi.selectedScrollSnap()){
            emblaApi.scrollTo(targetIndex);
        }
    }
  }, [value, items, emblaApi]);


  return (
    <div className="flex flex-col items-center w-24">
      <Button variant="ghost" size="icon" onClick={scrollPrev} className="h-8 w-8">
        <ChevronUp className="h-5 w-5" />
      </Button>
      <div className="h-40 w-full overflow-hidden" ref={emblaRef}>
        <div className="flex flex-col h-full">
          {items.map((item, index) => (
            <div key={`${label}-${index}`} className="flex-shrink-0 h-10 flex items-center justify-center text-lg min-h-0">
                {item}
            </div>
          ))}
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={scrollNext} className="h-8 w-8">
        <ChevronDown className="h-5 w-5" />
      </Button>
    </div>
  );
};


interface ScrollingDatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export const ScrollingDatePicker: React.FC<ScrollingDatePickerProps> = ({ date, setDate }) => {
  const [day, setDay] = React.useState(date.getDate());
  const [month, setMonth] = React.useState(date.getMonth());
  const [year, setYear] = React.useState(date.getFullYear());
  
  const daysInMonth = React.useMemo(() => getDaysInMonth(year, month), [year, month]);
  const dayItems = React.useMemo(() => range(1, daysInMonth), [daysInMonth]);

  React.useEffect(() => {
    setDay(date.getDate());
    setMonth(date.getMonth());
    setYear(date.getFullYear());
  }, [date]);

  React.useEffect(() => {
    const currentDaysInMonth = getDaysInMonth(year, month);
    const newDay = Math.min(day, currentDaysInMonth);
    
    const newDate = new Date(year, month, newDay);
    if (newDate.getTime() !== date.getTime()) {
      setDate(newDate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, month, year, setDate]);


  return (
    <div 
      className="flex justify-center items-center p-4 rounded-lg bg-popover"
    >
      <div className="flex space-x-2 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-10 w-full bg-primary/10 rounded-lg border border-primary/20"></div>
        </div>
        <ScrollPicker
          label="Day"
          items={dayItems}
          value={day}
          onValueChange={(val) => setDay(val as number)}
        />
        <ScrollPicker
          label="Month"
          items={months}
          value={months[month]}
          onValueChange={(val) => setMonth(months.indexOf(val as string))}
        />
        <ScrollPicker
          label="Year"
          items={years}
          value={year}
          onValueChange={(val) => setYear(val as number)}
        />
      </div>
    </div>
  );
};
