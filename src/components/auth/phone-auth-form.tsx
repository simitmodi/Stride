
"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { setupRecaptchaVerifier, sendPhoneOtp, onFirstPhoneSignIn } from "@/lib/firebase/auth";
import { auth } from "@/lib/firebase/config";

interface PhoneAuthFormProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhoneAuthForm({ children, open, onOpenChange }: PhoneAuthFormProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      // Reset state when dialog opens
      setStep("phone");
      setPhoneNumber("");
      setOtp("");
      setError(null);
      setIsLoading(false);
      // Setup reCAPTCHA verifier
      if (!(window as any).recaptchaVerifier) {
        setupRecaptchaVerifier("recaptcha-container-phone");
      }
    }
  }, [open]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
      setError("Please enter a valid phone number with country code (e.g., +12223334444).");
      setIsLoading(false);
      return;
    }

    try {
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await sendPhoneOtp(phoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep("otp");
      toast({ title: "OTP Sent", description: "An OTP has been sent to your phone." });
    } catch (err: any) {
      console.error("Phone auth error:", err);
      setError("Failed to send OTP. Please check the phone number or try again later.");
      // Reset reCAPTCHA
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.render().then((widgetId: any) => {
          (window as any).grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!confirmationResult) {
      setError("An unexpected error occurred. Please try again from the beginning.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await confirmationResult.confirm(otp);
      
      // Check if this is a new user
      if (userCredential.user) {
        await onFirstPhoneSignIn(userCredential.user);
      }

      toast({ title: "Success!", description: "You have successfully signed in." });
      onOpenChange(false);
      router.push("/dashboard/customer");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in with Phone</DialogTitle>
          <DialogDescription>
            {step === "phone"
              ? "Please enter your phone number with the country code."
              : "Enter the 6-digit OTP sent to your phone."}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <Input
              type="tel"
              placeholder="+1 555 123 4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify OTP
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setStep("phone")}
              className="p-0"
            >
              Back to phone number entry
            </Button>
          </form>
        )}
        <div id="recaptcha-container-phone"></div>
      </DialogContent>
    </Dialog>
  );
}
