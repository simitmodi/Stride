
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
import { signInWithEmail } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export function BankLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
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

    if (!window.grecaptcha) {
      toast({
        variant: "destructive",
        title: "CAPTCHA Error",
        description: "Could not connect to the reCAPTCHA service. Please check your connection or ad blocker.",
      });
      setIsLoading(false);
      return;
    }

    window.grecaptcha.enterprise.ready(async () => {
      try {
        const token = await window.grecaptcha.enterprise.execute('6Lfqw9IrAAAAAATsZvi3VG5KnxYHZWZA7eap6url', {action: 'LOGIN'});
        // In a real app, you would send this token to your backend for verification.
        console.log("reCAPTCHA Token:", token);

        const user = await signInWithEmail(values.email, values.password);
        if (user) {
          router.push("/dashboard/bank");
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid credentials or you do not have bank access.",
        });
      } finally {
        setIsLoading(false);
      }
    });
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
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
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
      </form>
    </Form>
  );
}
