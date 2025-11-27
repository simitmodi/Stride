
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    content: 'Stride services are available only to individuals aged 18 years and above. By using our services, you represent and warrant that you meet this eligibility requirement.',
  },
  {
    id: 'responsibilities',
    title: '3. User Responsibilities',
    content: [
      'Provide accurate, complete, and up-to-date information during registration.',
      'Use the platform solely for lawful purposes related to banking appointments.',
      'Maintain the confidentiality of your account credentials.',
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
      'We strive to ensure high availability but do not guarantee uninterrupted service.',
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
      '  - Attempt to gain unauthorized access to our systems.',
    ],
  },
  {
    id: 'ip',
    title: '6. Intellectual Property',
    content:
      'All content, trademarks, logos, and technology associated with Stride are the exclusive property of the platform. Unauthorized reproduction or usage is strictly prohibited.',
  },
  {
    id: 'privacy',
    title: '7. Privacy and Data Security',
    content: 'We are committed to protecting your privacy. Your personal data is processed in accordance with our Privacy Policy. We implement industry-standard security measures to safeguard your information.',
  },
  {
    id: 'liability',
    title: '8. Limitation of Liability',
    content: [
      'Stride shall not be held liable for:',
      '  - Bank policies, service delays, or cancellations.',
      '  - Losses due to unauthorized access or misuse of credentials.',
      '  - Technical issues or outages beyond its reasonable control.',
      'Our liability is limited to the maximum extent permitted by law.',
    ],
  },
  {
    id: 'termination',
    title: '9. Termination of Services',
    content: 'Stride reserves the right to suspend or terminate user accounts for violations of these Terms or for any other reason at our sole discretion.',
  },
  {
    id: 'governing',
    title: '10. Governing Law',
    content: 'These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Stride operates, without regard to its conflict of law provisions.',
  },
  {
    id: 'changes',
    title: '11. Changes to Terms',
    content: 'Stride may revise these Terms at any time. Significant updates will be communicated to users. Continued use of the platform constitutes acceptance of the revised terms.',
  },
];

export default function TermsAndConditionsPage() {
  const professionalBg = PlaceHolderImages.find(
    (p) => p.id === 'professional-bg-1'
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
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Terms & Conditions</h1>
        </div>

        <div className="grid w-full grid-cols-1 gap-6">
          {termsContent.map((section) => (
            <div key={section.id} className="group relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-75 blur-lg transition-all duration-500 group-hover:opacity-100 group-hover:blur-2xl"></div>
              <Card
                className="relative h-full w-full transform-gpu bg-card shadow-lg"
                style={{ backdropFilter: 'blur(12px)' }}
              >
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-foreground/80">
                  {formatContent(section.content)}
                </CardContent>
              </Card>
            </div>
          ))}
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
