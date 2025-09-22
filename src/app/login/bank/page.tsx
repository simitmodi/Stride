import { BankLoginForm } from "@/components/auth/bank-login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function BankLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Bank Portal Login</CardTitle>
          <CardDescription>
            For authorized personnel only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BankLoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/login" className="font-medium text-primary hover:underline">
              Not a bank employee?
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
