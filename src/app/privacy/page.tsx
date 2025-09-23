import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const privacyPolicyContent = [
  {
    id: 'info-collect',
    title: '1. Information We Collect',
    content: [
      'Personal Information: Name, email, phone number, banking branch details.',
      'Appointment Data: Scheduled visits, chosen services, uploaded documents.',
      'Usage Data: Device details, IP address, login activity.',
    ],
  },
  {
    id: 'info-use',
    title: '2. How We Use Your Information',
    content: [
      'To schedule and manage banking appointments.',
      'To send reminders, updates, and important notifications.',
      'To enhance platform functionality and user experience.',
      'To comply with legal, regulatory, and security requirements.',
    ],
  },
  {
    id: 'data-sharing',
    title: '3. Data Sharing',
    content: [
      'User information is shared only with partner banks for appointment confirmation.',
      'Stride does not sell, trade, or rent personal data to third parties.',
    ],
  },
  {
    id: 'data-security',
    title: '4. Data Security',
    content: [
      'Stride employs encryption, secure servers, and authentication safeguards to protect user data. However, no system can guarantee 100% security, and users share information at their own discretion.',
    ],
  },
  {
    id: 'user-rights',
    title: '5. User Rights',
    content: [
      'Access and update personal details through the dashboard.',
      'Request deletion of their account and associated data.',
      'Opt-out of non-essential notifications.',
    ],
  },
  {
    id: 'cookies-tracking',
    title: '6. Cookies & Tracking',
    content: [
      'Stride may use cookies and similar technologies to improve platform performance and analyze user behavior.',
    ],
  },
  {
    id: 'childrens-privacy',
    title: '7. Children’s Privacy',
    content: [
      'Stride is not intended for users under the age of 18. We do not knowingly collect data from minors.',
    ],
  },
  {
    id: 'policy-changes',
    title: '8. Changes to Privacy Policy',
    content: [
      'Stride may update this Privacy Policy periodically. Users will be notified of material changes.',
    ],
  },
  {
    id: 'contact-us',
    title: '9. Contact Us',
    content: [
      'For questions or concerns regarding privacy or terms, contact:',
      '📧 support@strideapp.in',
    ],
  },
];

export default function PrivacyPolicyPage() {
  const professionalBg = PlaceHolderImages.find(
    (p) => p.id === 'professional-bg'
  );

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
                <h1 className="text-4xl font-bold">Privacy Policy</h1>
              </div>

              {/* Desktop View */}
              <div className="hidden space-y-8 md:block">
                {privacyPolicyContent.map((section) => (
                  <div key={section.id}>
                    <h2 className="mb-3 text-2xl font-semibold">{section.title}</h2>
                    <div className="space-y-2 text-foreground/80">
                      {section.content.map((text, index) => (
                        <p key={index}>{text}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile View (Accordion) */}
              <div className="block md:hidden">
                <Accordion type="single" collapsible className="w-full">
                  {privacyPolicyContent.map((section) => (
                    <AccordionItem value={section.id} key={section.id}>
                      <AccordionTrigger className="text-left text-lg font-semibold">{section.title}</AccordionTrigger>
                      <AccordionContent className="space-y-2 pt-2 text-foreground/80">
                        {section.content.map((text, index) => (
                          <p key={index}>{text}</p>
                        ))}
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
