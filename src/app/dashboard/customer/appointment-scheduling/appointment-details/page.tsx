'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/firebase/provider';
import { collection, doc, Timestamp, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { checklistData, type ChecklistSection, type ChecklistItem as ChecklistItemType } from '@/lib/document-checklist-data';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const activitySchema = z.object({
  serviceCategory: z.string().min(1, 'Service category is required.'),
  specificService: z.string().min(1, 'Specific service is required.'),
  documents: z.record(z.string().or(z.boolean())).optional(),
});

const formSchema = z.object({
  activities: z.array(activitySchema).min(1, 'At least one service must be selected.'),
});

function AppointmentDetailsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const bankName = searchParams.get('bankName');
  const branch = searchParams.get('branch');
  const address = searchParams.get('address');
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const accountNumber = searchParams.get('accountNumber');

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activities: [{ serviceCategory: '', specificService: '', documents: {} }],
    },
  });

  const { control, handleSubmit, watch } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'activities',
  });

  const watchedActivities = watch('activities');

  const handleConfirmAppointment = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      const appointmentIds: string[] = [];
      const userDocRef = doc(db, 'users', user.uid);

      for (const activity of data.activities) {
        const confirmedDocuments = Object.entries(activity.documents || {})
          .filter(([, value]) => value !== false)
          .map(([key, value]) => (typeof value === 'string' ? `${key}: ${value}` : key));

        const newAppointmentRef = doc(collection(db, 'appointments'));
        
        const bankNameFormatted = bankName?.replace(/\s+/g, '') || 'NoBank';
        const timeSlotFormatted = time?.replace(/[\s:-]+/g, '') || 'NoTime';
        const customId = `${newAppointmentRef.id.substring(0, 12)}${bankNameFormatted}${timeSlotFormatted}`;

        const appointmentData = {
          userId: user.uid,
          bankName,
          branch,
          address,
          date: date ? Timestamp.fromDate(new Date(date)) : Timestamp.now(),
          time,
          accountNumber,
          serviceCategory: activity.serviceCategory,
          specificService: activity.specificService,
          confirmedDocuments,
          customAppointmentId: customId,
          createdAt: Timestamp.now(),
        };

        await setDoc(newAppointmentRef, appointmentData);
        await updateDoc(userDocRef, {
          appointmentIds: arrayUnion(newAppointmentRef.id)
        });
        appointmentIds.push(newAppointmentRef.id);
      }
      
      toast({
        title: 'Appointments Confirmed!',
        description: `Successfully booked ${appointmentIds.length} appointment(s).`,
      });

      const appointmentIdQuery = appointmentIds.join(',');
      router.push(`/dashboard/customer/appointment-confirmation?appointmentId=${appointmentIdQuery}`);

    } catch (error: any) {
      console.error("Error booking appointment:", error);
      toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex w-full flex-col items-center p-4 md:p-8" style={{ backgroundColor: '#BFBAB0' }}>
      <Card className="w-full max-w-2xl shadow-lg" style={{ backgroundColor: '#D0CBC1' }}>
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold" style={{ color: '#092910' }}>
            Select Your Service & Documents
          </CardTitle>
          <CardDescription className="text-center" style={{ color: '#000F00' }}>
            Choose the service(s) you need and confirm the required documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleConfirmAppointment)} className="space-y-8">
              <div className="space-y-6">
                {fields.map((field, index) => {
                  const selectedCategory = checklistData.find(c => c.category === watchedActivities[index]?.serviceCategory);
                  const selectedService = selectedCategory?.items.find(item => item.title === watchedActivities[index]?.specificService);

                  return (
                    <Card key={field.id} className="bg-card/70 border border-primary/20 p-4 relative">
                       {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove Service</span>
                        </Button>
                      )}
                      <CardContent className="p-2 space-y-4">
                        <h4 className="text-lg font-semibold text-primary">Service #{index + 1}</h4>
                        {/* Service Category */}
                        <div className="space-y-2">
                          <Label style={{ color: '#000F00' }}>Service Category:</Label>
                          <Controller
                            name={`activities.${index}.serviceCategory`}
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {checklistData.map(category => (
                                    <SelectItem key={category.category} value={category.category}>
                                      {category.category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                           {methods.formState.errors.activities?.[index]?.serviceCategory && <p className="text-sm text-destructive">{methods.formState.errors.activities?.[index]?.serviceCategory?.message}</p>}
                        </div>

                        {/* Specific Service */}
                        {selectedCategory && (
                          <div className="space-y-2">
                            <Label style={{ color: '#000F00' }}>Specific Service:</Label>
                            <Controller
                              name={`activities.${index}.specificService`}
                              control={control}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a service" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {selectedCategory.items.map(item => (
                                      <SelectItem key={item.title} value={item.title}>
                                        {item.title}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                             {methods.formState.errors.activities?.[index]?.specificService && <p className="text-sm text-destructive">{methods.formState.errors.activities?.[index]?.specificService?.message}</p>}
                          </div>
                        )}

                        {/* Document Checklist */}
                        {selectedService && (
                           <div className="space-y-4 rounded-lg border border-foreground/20 bg-background/5 p-4">
                            <h3 className="text-lg font-semibold" style={{ color: '#092910' }}>
                              Please confirm the documents you will bring:
                            </h3>
                            <div className="space-y-4">
                              {selectedService.content.map((doc, docIndex) => {
                                const docId = `activities.${index}.documents.${doc.text}`;
                                if (doc.type === 'options' && doc.choices) {
                                  return (
                                    <div key={docIndex} className="space-y-2 rounded-md border p-3">
                                      <Label className="font-medium" style={{ color: '#000F00' }}>{doc.text}</Label>
                                      <Controller
                                        name={docId as any}
                                        control={control}
                                        defaultValue={false}
                                        render={({ field }) => (
                                          <RadioGroup onValueChange={field.onChange} className="pl-2 space-y-1">
                                            {doc.choices!.map(choice => (
                                              <div key={choice} className="flex items-center space-x-2">
                                                <RadioGroupItem value={choice} id={`${docId}-${choice}`} />
                                                <Label htmlFor={`${docId}-${choice}`} className="font-normal" style={{ color: '#000F00' }}>
                                                  {choice}
                                                </Label>
                                              </div>
                                            ))}
                                          </RadioGroup>
                                        )}
                                      />
                                    </div>
                                  );
                                } else if (doc.type === 'required' || doc.type === 'optional') {
                                  return (
                                    <div key={docIndex} className="flex items-center space-x-2">
                                      <Controller
                                        name={docId as any}
                                        control={control}
                                        defaultValue={false}
                                        render={({ field }) => (
                                          <Checkbox
                                            id={docId}
                                            checked={!!field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        )}
                                      />
                                      <Label htmlFor={docId} className="font-normal" style={{ color: '#000F00' }}>
                                        {doc.type === 'required' && <span className="text-destructive">* </span>}
                                        {doc.text}
                                      </Label>
                                    </div>
                                  );
                                } else if (doc.type === 'note') {
                                  return (
                                    <p key={docIndex} className="pl-2 text-xs text-foreground/70 italic">{doc.text}</p>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-center">
                 <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ serviceCategory: '', specificService: '', documents: {} })}
                    className="w-full max-w-xs border-dashed"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Another Service
                </Button>
              </div>

              <Separator className="bg-primary/20" />

              {/* Buttons */}
              <div className="flex justify-center gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => router.back()} className="w-40">
                  Back
                </Button>
                <Button type="submit" className="w-48" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm Appointment(s)
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AppointmentDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AppointmentDetailsForm />
        </Suspense>
    )
}
