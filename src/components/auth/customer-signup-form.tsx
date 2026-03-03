
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
import { signUpWithEmail } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CalendarIcon, Loader2, Eye, EyeOff } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { PasswordStrength } from "@/components/password-strength";
import { Timestamp } from "firebase/firestore";
import { TermsCheckbox } from "@/components/TermsCheckbox";
import Link from "next/link";


const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
  terms: z.boolean().default(false).refine(val => val === true, {
    message: "You must accept the terms and conditions."
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine(data => {
  const password = data.password.toLowerCase();
  if (data.firstName && password.includes(data.firstName.toLowerCase())) return false;
  if (data.lastName && password.includes(data.lastName.toLowerCase())) return false;
  if (data.username && password.includes(data.username.toLowerCase())) return false;
  if (data.email && password.includes(data.email.split('@')[0].toLowerCase())) return false;
  if (data.dateOfBirth) {
    const dob = data.dateOfBirth;
    const day = dob.getDate().toString();
    const month = (dob.getMonth() + 1).toString();
    const year = dob.getFullYear().toString();
    if (password.includes(day) || password.includes(month) || password.includes(year)) return false;
  }
  // Check for consecutive numbers
  for (let i = 0; i <= 9; i++) {
    const seq = `${i}${i + 1}${i + 2}`;
    if (password.includes(seq)) return false;
  }
  return true;
}, {
  message: "Password cannot contain personal info or consecutive numbers.",
  path: ["password"],
});

export function CustomerSignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const termsValue = form.watch("terms");

  useEffect(() => {
    // Set default DOB only on the client-side to avoid hydration mismatch
    form.setValue(
      'dateOfBirth',
      new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    );
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await signUpWithEmail(values.email, values.password, values.firstName, values.lastName, values.username, values.dateOfBirth, 'customer');
      toast({
        title: "Success!",
        description: "Your account has been created.",
      });
      router.push("/dashboard/customer");

    } catch (error: any) {
      console.error("Sign-up failed:", error); // Log the full error
      let title = "Uh oh! Something went wrong.";
      let description = "There was a problem with your request. Please try again later.";

      switch (error.code) {
        case "auth/email-already-in-use":
          title = "Email Already Registered";
          description = "This email address is already in use. Please try logging in or use a different email.";
          break;
        case "auth/invalid-email":
          title = "Invalid Email";
          description = "Please enter a valid email address.";
          break;
        case "auth/weak-password":
          title = "Weak Password";
          description = "Your password should be at least 6 characters long.";
          break;
        default:
          // Handles other Firebase errors or generic errors
          if (error.message) {
            description = error.message;
          }
          break;
      }

      toast({
        variant: "destructive",
        title: title,
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 font-medium">First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    {...field}
                    className="bg-white border border-gray-200 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 font-medium">Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    {...field}
                    className="bg-white border border-gray-200 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-medium">Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe"
                  {...field}
                  className="bg-white border border-gray-200 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-gray-900 font-medium">Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-white border-gray-200 text-gray-900 hover:bg-gray-50 focus:border-indigo-400",
                        !field.value && "text-gray-400"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-gray-400" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    fromYear={1924}
                    toYear={currentYear}
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-medium">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  {...field}
                  className="bg-white border border-gray-200 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/50"
                />
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
              <FormLabel className="text-gray-900 font-medium">Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setPassword(e.target.value);
                    }}
                    className="pr-10 bg-white border border-gray-200 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/50"
                  />
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
        {password && <PasswordStrength password={password} />}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-medium">Confirm Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                    className="pr-10 bg-white border border-gray-200 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400/50"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-indigo-500 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 bg-gray-50/50 p-4">
              <FormControl>
                <TermsCheckbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          type="submit"
          disabled={isLoading || !termsValue}
          className="
            relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white
            shadow-md transition-all duration-300
            hover:opacity-90 hover:scale-[1.02]
            active:scale-[0.98]
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
            flex items-center justify-center gap-2
          "
          style={{ backgroundColor: "#4F46E5" }}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign Up
        </button>
      </form>
    </Form>
  );
}
