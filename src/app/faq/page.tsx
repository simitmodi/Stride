
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  BookUser,
  Building2,
  CalendarCheck,
  HelpCircle,
  Home,
  Settings,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const faqCategories = [
  {
    category: 'General',
    icon: HelpCircle,
    questions: [
      {
        q: 'What is Stride?',
        a: 'Stride is a data-driven platform that simplifies banking appointments across India. It helps users book slots, get document guidance, and receive reminders for visits.',
      },
      {
        q: 'How does Stride work?',
        a: 'Users register on the platform, select their bank branch, choose a service, and book an appointment. The system provides reminders and a personalized dashboard to track appointments.',
      },
      {
        q: 'Which banks are supported by Stride?',
        a: 'Stride works with partnered banks. Over time, more banks will be integrated to provide wider coverage.',
      },
       {
        q: 'What if my bank is not listed on Stride?',
        a: 'You can suggest your bank through the Feedback page. We’re constantly onboarding more banks across India.',
      },
      {
        q: 'Is Stride available across all cities in India?',
        a: 'Stride is being rolled out in phases. Availability may vary depending on bank tie-ups and regions.',
      },
      {
        q: 'Do I need to pay to use Stride?',
        a: 'No. Stride is free for users. Some banks may charge standard fees for their services, but Stride itself does not charge for booking appointments.',
      },
       {
        q: 'Does Stride support regional languages?',
        a: 'Yes. Stride aims to roll out support for multiple Indian languages in future updates for accessibility.',
      },
       {
        q: 'What happens if Stride services are unavailable due to maintenance?',
        a: 'Users will be notified in advance via email/SMS. Downtime will be minimized to avoid disruption.',
      },
    ],
  },
  {
    category: 'User Accounts',
    icon: User,
    questions: [
      {
        q: 'Is my personal data safe on Stride?',
        a: 'Yes. Stride uses encryption and secure servers to protect user data. We do not sell or rent your information to third parties.',
      },
       {
        q: 'Can I use Stride without creating an account?',
        a: 'No. Registration is mandatory to ensure secure handling of personal and banking-related information.',
      },
      {
        q: 'Can I share my account with family members?',
        a: 'No. Each user must have their own Stride account to maintain data security and accurate appointment records.',
      },
      {
        q: 'How do I update my personal details?',
        a: 'You can update your name, phone number, or email from your profile dashboard settings.',
      },
    ],
  },
  {
    category: 'Appointments',
    icon: CalendarCheck,
    questions: [
      {
        q: 'Can I reschedule or cancel an appointment?',
        a: 'Yes. Users can reschedule or cancel appointments directly from their dashboard, subject to the respective bank’s rules and availability.',
      },
      {
        q: 'What happens if I miss an appointment?',
        a: 'If you miss an appointment, you will need to reschedule through Stride. The platform will send reminders to minimize missed visits.',
      },
      {
        q: 'Do I still need to carry documents to the bank?',
        a: 'Yes. Stride provides a checklist of required documents for each service. Users must carry originals and copies as per the bank’s guidelines.',
      },
      {
        q: 'Does booking through Stride guarantee faster service at the bank?',
        a: 'Stride streamlines the scheduling process, but the final service time depends on the bank’s staff and workload.',
      },
      {
        q: 'Can I use Stride for multiple banks?',
        a: 'Yes. You can manage appointments for different banks from a single Stride account.',
      },
       {
        q: 'Can I book same-day appointments?',
        a: 'Availability of same-day slots depends on the respective bank’s scheduling system. Stride will display only the available slots.',
      },
    ],
  },
  {
    category: 'Bank Staff',
    icon: Building2,
    questions: [
      {
        q: 'Can bank staff also use Stride?',
        a: 'Yes. Bank staff can access appointment details, helping them manage workflows better and reduce customer wait times.',
      },
      {
        q: 'How do banks benefit from Stride?',
        a: 'Stride reduces branch congestion, helps staff prepare in advance with document details, and improves overall efficiency.',
      },
    ],
  },
  {
    category: 'Technical',
    icon: Settings,
    questions: [
      {
        q: 'What devices can I use Stride on?',
        a: 'Stride can be accessed via web browsers, and a mobile app is under development for Android and iOS.',
      },
      {
        q: 'How will I be notified of my appointment?',
        a: 'Stride sends email and SMS reminders. Push notifications will also be available in the mobile app.',
      },
      {
        q: 'What if I face technical issues while using Stride?',
        a: (
          <span>
            You can contact our support team via{' '}
            <a
              href="mailto:support@strideapp.in"
              className="text-primary underline hover:text-accent"
            >
              support@strideapp.in
            </a>
            .
          </span>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  const professionalBg = PlaceHolderImages.find((p) => p.id === 'faq-bg');

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

      <main className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <div className="mb-8 text-center text-foreground">
          <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="mt-2 text-lg text-foreground/80">
            Find quick answers to common queries about Stride.
          </p>
        </div>

        <div className="w-full space-y-8">
          {faqCategories.map((category) => (
            <div key={category.category}>
              <div className="mb-4 flex items-center gap-3">
                <category.icon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                  {category.category}
                </h2>
              </div>
              <div className="group relative w-full">
                 <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-75 blur-lg transition-all duration-500 group-hover:opacity-100 group-hover:blur-2xl"></div>
                <div
                  className="relative w-full rounded-xl bg-card p-4 shadow-lg md:p-6"
                  style={{ backdropFilter: 'blur(12px)' }}
                >
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border-black"
                      >
                        <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-foreground/80">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 w-full max-w-2xl text-center">
            <h3 className="text-xl font-semibold text-foreground">Still have questions?</h3>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-1">
                <Button asChild variant="outline" size="lg" className="h-auto py-3 bg-card group">
                    <Link href="/contact" className="flex flex-col items-start text-left">
                        <div className='flex items-center gap-2'>
                        <BookUser className="h-5 w-5 text-primary"/>
                        <span className="font-semibold text-foreground group-hover:text-[#FFF0FF]">Contact Helpdesk</span>
                        </div>
                        <p className="mt-1 text-sm text-foreground/70 whitespace-normal group-hover:text-[#FFF0FF]">Get in touch with our support team for further assistance.</p>
                    </Link>
                </Button>
            </div>
        </div>


        <div className="mt-12">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="h-12 w-12 bg-card/5"
          >
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
