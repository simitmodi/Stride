
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/countries";

interface PhoneAuthFormProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhoneAuthForm({ children, open, onOpenChange }: PhoneAuthFormProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [countryCode, setCountryCode] = useState("+91");
  const [nationalNumber, setNationalNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      // Reset state and clear verifier when dialog closes
      setStep("phone");
      setNationalNumber("");
      setOtp("");
      setError(null);
      setIsLoading(false);
      const recaptchaContainer = document.getElementById("recaptcha-container-phone");
      if (recaptchaContainer) {
        recaptchaContainer.innerHTML = "";
      }
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
      }
    }
  }, [open]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const phoneNumber = `${countryCode}${nationalNumber}`;

    if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
      setError("Please enter a valid phone number.");
      setIsLoading(false);
      return;
    }

    try {
      const appVerifier = setupRecaptchaVerifier("recaptcha-container-phone");
      const result = await sendPhoneOtp(phoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep("otp");
      toast({ title: "OTP Sent", description: `An OTP has been sent to ${phoneNumber}.` });
    } catch (err: any) {
      console.error("Phone auth error:", err);
      setError("Failed to send OTP. Please check the phone number or try again later.");
      const recaptchaContainer = document.getElementById("recaptcha-container-phone");
      if (recaptchaContainer) {
        recaptchaContainer.innerHTML = "";
      }
       if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
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

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
        setCountryCode(country.dial_code);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in with Phone</DialogTitle>
          <DialogDescription>
            {step === "phone"
              ? "Please select your country and enter your phone number."
              : "Enter the 6-digit OTP sent to your phone."}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Select defaultValue="IN" onValueChange={handleCountryChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.name} ({country.dial_code})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="tel"
                placeholder="Phone number"
                value={nationalNumber}
                onChange={(e) => setNationalNumber(e.target.value.replace(/\D/g, ''))}
                required
                className="flex-1"
              />
            </div>
             <div id="recaptcha-container-phone" className="my-2 flex justify-center"></div>
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
              onClick={() => {
                setStep("phone");
                setError(null);
                setOtp("");
              }}
              className="p-0"
            >
              Back to phone number entry
            </Button>
          </form>
        )}
       
      </DialogContent>
    </Dialog>
  );
}
