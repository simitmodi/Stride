
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  ArrowRight,
  BookUser,
  Bug,
  CalendarPlus,
  Mail,
  MessageSquareHeart,
  ShieldQuestion,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const contactOptions = [
  {
    icon: CalendarPlus,
    title: 'Raise Appointment Request',
    description: 'Need to schedule a new visit? Head to your dashboard to book an appointment.',
    link: '/login/customer',
    linkText: 'Go to Dashboard',
  },
  {
    icon: MessageSquareHeart,
    title: 'Customer Support',
    description:
      'For general inquiries or help with your account, our support team is ready to assist.',
    link: 'mailto:support@strideapp.in',
    linkText: 'Email Support',
  },
  {
    icon: Bug,
    title: 'Report an Issue',
    description:
      'Encountered a technical problem? Let us know so we can fix it right away.',
    link: '/feedback',
    linkText: 'Report an Issue',
  },
  {
    icon: Mail,
    title: 'Write to Us',
    description:
      'You can reach our corporate office by mail for formal correspondence.',
    link: 'mailto:corporate@strideapp.in',
    linkText: 'Send Email',
    address: 'Stride Inc., 123 Finance Avenue, Mumbai, MH 400001, India',
  },
  {
    icon: ShieldQuestion,
    title: 'Raise a Complaint',
    description:
      'If you have a grievance, please use our formal process to have it addressed.',
    link: '/feedback',
    linkText: 'Submit Complaint',
  },
  {
    icon: BookUser,
    title: 'Visit Helpdesk',
    description:
      'Find answers to common questions in our comprehensive help section.',
    link: '/faq',
    linkText: 'Visit FAQs',
  },
];

export default function ContactPage() {
  const professionalBg = PlaceHolderImages.find(
    (p) => p.id === 'contact-bg'
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4 pt-24 md:pt-32">
      {professionalBg && (
        <Image
          src={professionalBg.imageUrl}
          alt={professionalBg.description}
          fill
          className="object-cover"
          style={{ filter: 'blur(8px)' }}
          data-ai-hint={professionalBg.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-card/75" />

      <main className="relative z-10 flex w-full max-w-6xl flex-col items-center">
        <div className="mb-8 text-center text-foreground">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-lg text-foreground/80">
            We are here to help. Please choose an option below.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contactOptions.map((option) => (
            <div key={option.title} className="group relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-75 blur transition-all duration-300 group-hover:opacity-100 group-hover:blur-md"></div>
              <Card className="relative flex h-full w-full transform-gpu flex-col justify-between bg-card/15 p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-100"
                style={{ backdropFilter: 'blur(12px)' }}
              >
                <div>
                  <CardHeader className="flex-row items-start gap-4 p-0">
                    <option.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl text-foreground">
                      {option.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 pt-4">
                    <CardDescription className="text-foreground/80">
                      {option.description}
                    </CardDescription>
                    {option.address && (
                      <p className="mt-2 text-xs text-foreground/60">
                        {option.address}
                      </p>
                    )}
                  </CardContent>
                </div>
                <div className="mt-6">
                  <Link
                    href={option.link}
                    className="group/link inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-accent"
                  >
                    {option.linkText}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-foreground/80">
          <Link href="/" className="underline hover:text-primary">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
