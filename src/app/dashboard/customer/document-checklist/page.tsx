'use client';

import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { checklistData } from '@/lib/document-checklist-data';
import type { ChecklistItem as ChecklistItemType } from '@/lib/document-checklist-data';
import Link from 'next/link';
import { ArrowRight, PanelLeft } from 'lucide-react';
import ElectricBorder from '@/components/ElectricBorder';
import ShinyText from '@/components/ShinyText';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';

const ChecklistContent = ({ item }: { item: ChecklistItemType }) => {
  const renderContent = (contentItem: ChecklistItemType['content'][0]) => {
    switch (contentItem.type) {
      case 'required':
        return (
          <li>
            <span>{contentItem.text}</span>
            <span className="text-destructive font-bold ml-1">*</span>
          </li>
        );
      case 'optional':
        return (
          <li>
            <span>{contentItem.text}</span>
          </li>
        );
      case 'options':
        return (
          <li>
            <div className="flex flex-col gap-1">
              <span>{contentItem.text} &rarr;</span>
              <span className="text-foreground/80 text-base">
                {contentItem.choices?.join(' / ')}
              </span>
            </div>
          </li>
        );
      case 'note':
        return (
          <li className="list-none text-sm text-foreground/70 italic mt-1">
            {contentItem.text}
          </li>
        );
      default:
        return null;
    }
  };

  return (
    <ul className="space-y-4 text-foreground font-body text-lg list-disc pl-8">
      {item.content.map((c, index) => (
        <React.Fragment key={index}>{renderContent(c)}</React.Fragment>
      ))}
    </ul>
  );
};

const CustomTrigger = () => {
    const { toggleSidebar } = useSidebar();
    return (
        <Button 
            onClick={toggleSidebar} 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 text-[#092910] hover:bg-[#092910]/10"
        >
            <PanelLeft className="h-6 w-6" />
        </Button>
    )
}

export default function DocumentChecklistPage() {
  const [activeCategory, setActiveCategory] = useState(checklistData[0].category);

  const activeData = checklistData.find((c) => c.category === activeCategory) || checklistData[0];

  return (
    <div className="h-screen w-full bg-[#BFBAB0]">
      <SidebarProvider className="h-full">
        <Sidebar className="border-r border-[#092910]/10 [&>[data-sidebar=sidebar]]:bg-[#CCC9BD]" collapsible="icon">
          <SidebarHeader className="flex flex-row group-data-[state=expanded]:justify-end group-data-[state=collapsed]:justify-center py-4 h-16 shrink-0">
             <CustomTrigger />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
                <div className="px-4 py-4 mb-4 group-data-[collapsible=icon]:hidden">
                  <h1 className="text-2xl font-bold text-[#092910] font-headline">Documents</h1>
                </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {checklistData.map((section) => (
                    <SidebarMenuItem key={section.category}>
                      <SidebarMenuButton
                        onClick={() => setActiveCategory(section.category)}
                        isActive={activeCategory === section.category}
                        className="data-[active=true]:bg-[#092910] data-[active=true]:text-white hover:bg-[#092910]/10 text-[#092910] font-medium transition-colors p-3 h-auto"
                      >
                         <section.icon className="h-5 w-5 mr-2" />
                        <span>{section.category}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
             <ElectricBorder className="w-full inline-block p-1" style={{ borderRadius: '25px' }}>
                <Button asChild variant="outline" className="w-full border-none bg-transparent hover:bg-transparent justify-start px-2">
                    <Link href="/dashboard/customer/appointment-scheduling" className="flex items-center gap-2">
                        <ShinyText text="Book Appointment" disabled={false} speed={2} className="font-semibold text-sm" />
                        <ArrowRight className="h-4 w-4 text-[#082B12] ml-auto" />
                    </Link>
                </Button>
            </ElectricBorder>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-[#BFBAB0] flex flex-col h-full overflow-hidden">


            <ScrollStack 
                key={activeCategory}
                className="flex-1 w-full h-full" 
                itemDistance={150} 
                stackPosition="10%" 
                itemStackDistance={40} 
                itemScale={0.02}
                baseScale={1}
            >
                {activeData.items.map((item, index) => (
                    <ScrollStackItem key={index} itemClassName="w-full flex justify-center pb-32">
                        <Card className="w-[90vw] md:w-[60vw] h-auto shadow-2xl border-none bg-[#D0CDC2]">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-[#092910]">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChecklistContent item={item} />
                            <div className="flex flex-row justify-between items-end mt-8">
                                <ElectricBorder className="inline-block p-1" style={{ borderRadius: '25px' }}>
                                    <Button asChild variant="outline" className="border-none bg-transparent hover:bg-transparent px-4">
                                        <Link href="/dashboard/customer/appointment-scheduling" className="flex items-center gap-2">
                                            <ShinyText text="Book Appointment" disabled={false} speed={2} className="font-semibold text-sm" />
                                            <ArrowRight className="h-4 w-4 text-[#082B12] ml-auto" />
                                        </Link>
                                    </Button>
                                </ElectricBorder>
                                <div className="text-right text-sm text-destructive font-semibold pb-2">
                                    * means compulsory
                                </div>
                            </div>
                        </CardContent>
                        </Card>
                    </ScrollStackItem>
                ))}
            </ScrollStack>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

