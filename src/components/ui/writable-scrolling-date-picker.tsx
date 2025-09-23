
"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollingDatePicker } from "@/components/ui/scrolling-date-picker";

interface WritableScrollingDatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export const WritableScrollingDatePicker: React.FC<WritableScrollingDatePickerProps> = ({ date, setDate }) => {
  const [inputValue, setInputValue] = React.useState<string>(format(date, "dd/MM/yyyy"));
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setInputValue(format(date, "dd/MM/yyyy"));
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const parsedDate = parse(inputValue, "dd/MM/yyyy", new Date());
    if (isValid(parsedDate)) {
      setDate(parsedDate);
    } else {
      // Reset to the last valid date if input is invalid
      setInputValue(format(date, "dd/MM/yyyy"));
    }
  };
  
  const handleDateSelect = (newDate: Date) => {
    setDate(newDate);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="DD/MM/YYYY"
              className="pr-10"
            />
            <Button
                variant={"outline"}
                size="icon"
                className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8",
                    !date && "text-muted-foreground"
                )}
                onClick={() => setOpen(o => !o)}
            >
                <CalendarIcon className="h-4 w-4" />
            </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <ScrollingDatePicker
          date={date}
          setDate={handleDateSelect}
        />
      </PopoverContent>
    </Popover>
  );
};
