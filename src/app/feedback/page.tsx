
import { FeedbackForm } from "@/components/feedback-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function FeedbackPage() {
  const professionalBg = PlaceHolderImages.find((p) => p.id === "feedback-bg");

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4 pt-24 md:pt-32">
      {professionalBg && (
        <Image
          src={professionalBg.imageUrl}
          alt={professionalBg.description}
          fill
          className="object-cover"
          style={{ filter: "blur(8px)" }}
          data-ai-hint={professionalBg.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-card/75" />

      <main className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="group relative w-full">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-75 blur-lg transition-all duration-300 group-hover:opacity-100 group-hover:blur-xl"></div>
          <Card
            className="relative w-full transform-gpu bg-card shadow-lg"
            style={{ backdropFilter: "blur(12px)" }}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground">
                We Value Your Feedback
              </CardTitle>
              <CardDescription className="text-foreground/80">
                Help us improve your Stride experience by sharing your thoughts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeedbackForm />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Button asChild variant="outline" size="icon" className="h-12 w-12 bg-card/5">
            <Link href="/">
              <Home className="h-6 w-6" />
              <span className="sr-only">Back to Home</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
