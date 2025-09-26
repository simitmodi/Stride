
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Check, Pencil, X } from "lucide-react";
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

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
  inputType?: string;
}

export function EditableField({ label, value, onSave, inputType = "text" }: EditableFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Reset to original value when opening
      setCurrentValue(value);
    }
    setIsOpen(open);
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="field-input" className="text-right text-foreground/80">
              {label}
            </Label>
            <Input
              id="field-input"
              type={inputType}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="col-span-3"
            />
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
