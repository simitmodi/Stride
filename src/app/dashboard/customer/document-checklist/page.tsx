
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { checklistData } from '@/lib/document-checklist-data';
import type { ChecklistItem as ChecklistItemType } from '@/lib/document-checklist-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ChecklistItem = ({ item }: { item: ChecklistItemType }) => {
  const renderContent = (contentItem: ChecklistItemType['content'][0]) => {
    switch (contentItem.type) {
      case 'required':
        return (
          <li className="flex items-start gap-2">
            <span className="text-destructive font-bold">*</span>
            <span>{contentItem.text}</span>
          </li>
        );
      case 'optional':
        return (
          <li className="flex items-start gap-2 pl-4">
            <span>{contentItem.text}</span>
          </li>
        );
      case 'options':
        return (
          <li className="flex flex-col gap-1 pl-4">
            <span>{contentItem.text} &rarr;</span>
            <span className="text-foreground/80 text-sm">
              {contentItem.choices?.join(' / ')}
            </span>
          </li>
        );
      case 'note':
        return (
          <li className="pl-4 text-xs text-foreground/70 italic">
            {contentItem.text}
          </li>
        );
      default:
        return null;
    }
  };

  return (
    <ul className="space-y-2 text-foreground font-body">
      {item.content.map((c, index) => (
        <div key={index}>{renderContent(c)}</div>
      ))}
    </ul>
  );
};

export default function DocumentChecklistPage() {
  return (
    <div
      className="flex min-h-full w-full flex-col items-center p-4 md:p-8"
      style={{ backgroundColor: '#BFBAB0' }}
    >
      <div className="w-full max-w-5xl">
        {checklistData.map((section) => (
          <div key={section.category} className="mb-12">
            <div className="mb-6 flex items-center gap-4">
              <section.icon
                className="h-10 w-10"
                style={{ color: '#092910' }}
              />
              <h2
                className="text-3xl font-bold font-headline"
                style={{ color: '#092910' }}
              >
                {section.category}
              </h2>
            </div>

            <Card
              className="w-full shadow-lg"
              style={{ backgroundColor: '#D0CBC1' }}
            >
              <CardContent className="p-4 md:p-6">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                >
                  {section.items.map((item, index) => (
                    <AccordionItem
                      key={item.title}
                      value={`item-${index}`}
                      className="border-foreground/20"
                    >
                      <AccordionTrigger className="text-left font-headline text-lg hover:no-underline text-[#000F00]">
                        {item.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ChecklistItem item={item} />
                        <div className="flex justify-center pt-4">
                            <Button asChild variant="link" className="text-primary hover:text-accent">
                                <Link href="/dashboard/customer/appointment-scheduling">
                                    Book an Appointment
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
