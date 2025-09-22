import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Banknote, User } from 'lucide-react';
import Link from 'next/link';

export default function LoginOptionsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Banknote className="inline-block h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold">Login to Stride</h1>
          <p className="mt-2 text-muted-foreground">
            Choose your role to continue.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Link href="/login/customer" className="group">
            <Card className="hover:border-primary hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                <User className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <CardTitle>Customer Login</CardTitle>
                  <CardDescription>
                    Access your personal account.
                  </CardDescription>
                </div>
                 <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardHeader>
            </Card>
          </Link>
          <Link href="/login/bank" className="group">
            <Card className="hover:border-primary hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                 <Banknote className="h-8 w-8 text-primary" />
                 <div className="flex-1">
                  <CardTitle>Bank Login</CardTitle>
                  <CardDescription>
                    Access the employee portal.
                  </CardDescription>
                 </div>
                 <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardHeader>
            </Card>
          </Link>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <Link href="/" className="underline hover:text-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
