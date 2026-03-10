
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail, signOutUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Eye, EyeOff, Fingerprint } from "lucide-react";
import { isPasskeySupported, authenticateWithPasskey } from "@/lib/auth/passkeys";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";



const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export function BankLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const user = await signInWithEmail(values.email, values.password);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().role === 'bank') {
          router.push("/dashboard/bank");
        } else {
          await signOutUser();
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You do not have permission to access the bank portal.",
          });
        }
      }
    } catch (error: any) {
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = "Invalid credentials. Please check your email and password.";
      } else if (error.code === 'auth/too-many-requests') {
        description = "Access to this account has been temporarily disabled due to many failed login attempts. You can try again later.";
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee Email</FormLabel>
              <FormControl>
                <Input placeholder="employee@stridebank.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className="pr-10" />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-indigo-500 hover:bg-transparent"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full h-11 text-base transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent hover:text-accent-foreground"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-foreground/40">
            <span className="bg-card px-3">or</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={async () => {
            setIsLoading(true);
            try {
              await authenticateWithPasskey();

              // Phase 1: Demo Session Bypass
              sessionStorage.setItem("passkey_authenticated", "true");

              router.push("/dashboard/bank");
            } catch (err) {
              // handle error
            } finally {
              setIsLoading(false);
            }
          }}
          variant="outline"
          className="w-full h-11 transition-all duration-300 hover:bg-primary hover:text-white group border-white/10"
        >
          <Fingerprint className="mr-2 h-5 w-5 text-primary group-hover:text-white" />
          Sign in with Passkey
        </Button>
      </form>
    </Form>
  );
}

// Stride: Professional Financial Connectivity
