
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const calculateStrength = (password: string) => {
  let score = 0;
  if (password.length > 8) score++;
  if (password.length > 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthLevels = {
  0: { label: "Weak", color: "bg-destructive" },
  1: { label: "Weak", color: "bg-destructive" },
  2: { label: "Fair", color: "bg-yellow-500" },
  3: { label: "Good", color: "bg-yellow-500" },
  4: { label: "Strong", color: "bg-green-500" },
  5: { label: "Strong", color: "bg-green-500" },
};

export function PasswordStrength({ password }: { password?: string }) {
  if (!password) return null;
  const strength = calculateStrength(password);
  const { label, color } = strengthLevels[strength as keyof typeof strengthLevels];

  return (
    <div className="space-y-2">
      <Progress value={(strength / 5) * 100} className={cn("h-2", color)} />
      <p className="text-sm text-muted-foreground">
        Password strength: <span className={cn("font-semibold", color.replace("bg-", "text-"))}>{label}</span>
      </p>
    </div>
  );
}
