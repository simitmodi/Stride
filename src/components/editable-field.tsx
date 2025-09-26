
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { ScrollingDatePicker } from "./ui/scrolling-date-picker";

interface EditableFieldProps {
  label: string;
  value: string;
  editValue?: string;
  onSave: (newValue: string | Date) => void;
  inputType?: string;
  dateValue?: Date;
}

export function EditableField({ label, value, editValue, onSave, inputType = "text", dateValue }: EditableFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(editValue ?? value);
  const [currentDate, setCurrentDate] = useState<Date | undefined>(dateValue);

  const handleSave = () => {
    if (inputType === 'date' && currentDate) {
      onSave(currentDate);
    } else {
      onSave(currentValue);
    }
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Reset to original value when opening
      setCurrentValue(editValue ?? value);
      if (inputType === 'date') {
        setCurrentDate(dateValue);
      }
    }
    setIsOpen(open);
  };

  const renderInput = () => {
    if (inputType === "date") {
      return (
        <ScrollingDatePicker
            date={currentDate}
            onDateChange={setCurrentDate}
        />
      );
    }
    return (
      <Input
        id="field-input"
        type={inputType}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        className="col-span-3"
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground/70">{label}</p>
          <p className="text-foreground">{value}</p>
        </div>
        <DialogTrigger asChild>
          <Button variant="link" className="text-primary hover:text-accent">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-[425px] bg-card/95" style={{ backdropFilter: 'blur(12px)' }}>
        <DialogHeader>
          <DialogTitle className="text-primary">Edit {label}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className={cn("grid items-center gap-4", inputType !== 'date' && 'grid-cols-4')}>
            {inputType !== 'date' &&
              <Label htmlFor="field-input" className="text-right text-foreground/80">
                {label}
              </Label>
            }
            {renderInput()}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
