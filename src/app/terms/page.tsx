import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const termsContent = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content:
      'By accessing or using Stride, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of the platform.',
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    content: 'Stride services are available only to individuals aged 18 years and above.',
  },
  {
    id: 'responsibilities',
    title: '3. User Responsibilities',
    content: [
      'Provide accurate, complete, and up-to-date information during registration.',
      'Ensure that uploaded documents are valid, authentic, and legally acceptable.',
      'Use the platform solely for lawful purposes related to banking appointments.',
    ],
  },
  {
    id: 'services',
    title: '4. Platform Services',
    content: [
      'Stride enables users to:',
      '  - Schedule banking appointments.',
      '  - Receive reminders and notifications.',
      '  - Access a personalized dashboard for upcoming visits.',
      '  - Track activities via an integrated calendar view.',
      'Note: Appointment confirmation is subject to the respective bank’s policies. Stride does not guarantee approval.',
    ],
  },
  {
    id: 'prohibited',
    title: '5. Prohibited Activities',
    content: [
      'Users must not:',
      '  - Misuse, manipulate, or overload the appointment system.',
      '  - Submit fraudulent, false, or misleading documents.',
      '  - Interfere with, disrupt, or compromise the platform’s functionality.',
    ],
  },
  {
    id: 'ip',
    title: '6. Intellectual Property',
    content:
      'All content, trademarks, logos, and technology associated with Stride are the exclusive property of the platform. Unauthorized reproduction or usage is strictly prohibited.',
  },
  {
    id: 'liability',
    title: '7. Limitation of Liability',
    content: [
      'Stride shall not be held liable for:',
      '  - Bank policies, service delays, or cancellations.',
      '  - Losses due to unauthorized access or misuse of credentials.',
      '  - Technical issues or outages beyond its reasonable control.',
    ],
  },
  {
    id: 'termination',
    title: '8. Termination of Services',
    content: 'Stride reserves the right to suspend or terminate user accounts for violations of these Terms.',
  },
  {
    id: 'changes',
    title: '9. Changes to Terms',
    content: 'Stride may revise these Terms at any time. Significant updates will be communicated to users.',
  },
];

export default function TermsAndConditionsPage() {
  const professionalBg = PlaceHolderImages.find(
    (p) => p.id === 'professional-bg'
  );

  const formatContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.map((line, index) => (
        <p key={index} className={line.startsWith('  -') ? 'ml-4' : ''}>
          {line.replace('  - ', '• ')}
        </p>
      ));
    }
    return <p>{content}</p>;
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
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
      <div className="absolute inset-0 bg-background/60" />

      <main className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <div className="group relative w-full">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-75 blur-lg transition-all duration-300 group-hover:opacity-100 group-hover:blur-xl"></div>
          <div
            className="relative w-full rounded-xl bg-card/15 p-8 shadow-lg md:p-12"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            <div className="flex flex-col gap-6 text-foreground">
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold">Terms & Conditions</h1>
              </div>

              {/* Desktop View */}
              <div className="hidden space-y-8 md:block">
                {termsContent.map((section) => (
                  <div key={section.id}>
                    <h2 className="mb-3 text-2xl font-semibold">{section.title}</h2>
                    <div className="space-y-2 text-foreground/80">{formatContent(section.content)}</div>
                  </div>
                ))}
              </div>

              {/* Mobile View (Accordion) */}
              <div className="block md:hidden">
                <Accordion type="single" collapsible className="w-full">
                  {termsContent.map((section) => (
                    <AccordionItem value={section.id} key={section.id}>
                      <AccordionTrigger className="text-left text-lg font-semibold">{section.title}</AccordionTrigger>
                      <AccordionContent className="space-y-2 pt-2 text-foreground/80">
                        {formatContent(section.content)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
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
