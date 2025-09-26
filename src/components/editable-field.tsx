
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Check, Pencil, X } from "lucide-react";

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
  inputType?: string;
}

export function EditableField({ label, value, onSave, inputType = "text" }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <p className="font-semibold text-foreground/70">{label}</p>
        <div className="flex items-center gap-2">
          <Input
            type={inputType}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="flex-grow"
          />
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Check className="h-5 w-5 text-green-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <X className="h-5 w-5 text-destructive" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-foreground/70">{label}</p>
        <p className="text-foreground">{value}</p>
      </div>
      <Button variant="link" className="text-primary hover:text-accent" onClick={() => setIsEditing(true)}>
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </Button>
    </div>
  );
}

    