'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/firebase/provider';
import { collection, doc, Timestamp, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

import { Button } from '@/components/ui/button';
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
import { checklistData } from '@/lib/document-checklist-data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [bookingData, setBookingData] = useState<{
    bankName?: string;
    branch?: string;
    address?: string;
    date?: string;
    time?: string;
    accountNumber?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('appointmentData');
      if (stored) {
        setBookingData(JSON.parse(stored));
      } else {
        toast({ title: "Session Expired", description: "Please start the booking process again.", variant: "destructive" });
        router.push('/dashboard/customer/appointment-scheduling');
      }
    }
  }, [router, toast]);

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activities: [{ serviceCategory: '', specificService: '', documents: {} }],
    },
  });

  const { control, handleSubmit, watch, formState } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'activities',
  });

  const watchedActivities = watch('activities');

  const handleConfirmAppointment = async (data: z.infer<typeof formSchema>) => {
    if (!user || !bookingData) {
      toast({ title: "Error", description: "Session data or user missing.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    const { bankName, branch, address, date, time, accountNumber } = bookingData;

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

        const appointmentDataToSave = {
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

        await setDoc(newAppointmentRef, appointmentDataToSave);
        await updateDoc(userDocRef, {
          appointmentIds: arrayUnion(newAppointmentRef.id)
        });
        appointmentIds.push(newAppointmentRef.id);
      }
      
      toast({
        title: 'Appointments Confirmed!',
        description: `Successfully booked ${appointmentIds.length} appointment(s).`,
      });

      // Clear session storage now that booking is complete
      sessionStorage.removeItem('appointmentData');

      const appointmentIdQuery = appointmentIds.join(',');
      router.push(`/dashboard/customer/appointment-confirmation?appointmentId=${appointmentIdQuery}`);

    } catch (error: any) {
      console.error("Error booking appointment:", error);
      toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!bookingData) {
    return (
      <div className="flex w-full h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] overflow-hidden">
      {/* ── Ambient Background Layer ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingDoodles />
      </div>
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <style>{`
          .ambient-glow { filter: blur(140px); border-radius: 9999px; position: fixed; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="ambient-glow w-[50vw] h-[50vh] bg-indigo-500/10 top-[-10%] left-[-10%]" />
        <div className="ambient-glow w-[40vw] h-[40vh] bg-purple-500/10 bottom-[10%] right-[-5%]" />
        <div className="ambient-glow w-[30vw] h-[30vh] bg-blue-400/5 top-[40%] right-[30%]" />
      </div>

      <div className="relative z-10 flex w-full h-full flex-col md:flex-row justify-center gap-8 p-4 md:p-8">
        
        {/* ── Main Form Area ── */}
        <div className="w-full max-w-3xl flex flex-col h-full">
          <div className="mb-8 pl-4">
            <p className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-2 animate-pulse">Configuration</p>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Services & Documents</h1>
          </div>

          <div className="relative overflow-y-auto no-scrollbar rounded-[2rem] border border-gray-100 bg-white/70 shadow-2xl backdrop-blur-xl p-8 flex-1 flex flex-col">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleConfirmAppointment)} className="flex flex-col flex-1 h-full space-y-8">
              
              <div className="flex-1 space-y-6">
                <AnimatePresence>
                  {fields.map((field, index) => {
                    const selectedCategory = checklistData.find(c => c.category === watchedActivities[index]?.serviceCategory);
                    const selectedService = selectedCategory?.items.find(item => item.title === watchedActivities[index]?.specificService);

                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, height: 0 }} 
                        key={field.id} 
                        className="bg-white/60 backdrop-blur-md border border-gray-200/60 p-6 rounded-3xl relative shadow-sm"
                      >
                         {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8 transition-colors"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove Service</span>
                          </Button>
                        )}
                        <div className="space-y-6">
                          <h4 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                            <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">{index + 1}</span>
                            Service Details
                          </h4>
                          
                          {/* Service Category */}
                          <div className="space-y-3">
                            <Label className="text-gray-700 font-semibold">Service Category</Label>
                            <Controller
                              name={`activities.${index}.serviceCategory`}
                              control={control}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className="h-12 rounded-xl bg-white/50 border-gray-200">
                                    <SelectValue placeholder="Select a category..." />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl">
                                    {checklistData.map(category => (
                                      <SelectItem key={category.category} value={category.category}>
                                        {category.category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                             {formState.errors.activities?.[index]?.serviceCategory && <p className="text-sm text-red-500">{formState.errors.activities?.[index]?.serviceCategory?.message}</p>}
                          </div>

                          {/* Specific Service */}
                          {selectedCategory && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                              <Label className="text-gray-700 font-semibold">Specific Service</Label>
                              <Controller
                                name={`activities.${index}.specificService`}
                                control={control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="h-12 rounded-xl bg-white/50 border-gray-200">
                                      <SelectValue placeholder="Select specific service..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                      {selectedCategory.items.map(item => (
                                        <SelectItem key={item.title} value={item.title}>
                                          {item.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                               {formState.errors.activities?.[index]?.specificService && <p className="text-sm text-red-500">{formState.errors.activities?.[index]?.specificService?.message}</p>}
                            </motion.div>
                          )}

                          {/* Document Checklist */}
                          {selectedService && (
                             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 space-y-4">
                              <h3 className="text-md font-semibold text-indigo-900 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-indigo-500" /> Documents Needed
                              </h3>
                              <div className="space-y-4 pt-2">
                                {selectedService.content.map((docItem, docIndex) => {
                                  const docId = `activities.${index}.documents.${docItem.text}`;
                                  if (docItem.type === 'options' && docItem.choices) {
                                    return (
                                      <div key={docIndex} className="space-y-3 rounded-xl bg-white p-4 border border-indigo-100 shadow-sm">
                                        <Label className="font-semibold text-gray-700">{docItem.text}</Label>
                                        <Controller
                                          name={docId as any}
                                          control={control}
                                          defaultValue={false}
                                          render={({ field }) => (
                                            <RadioGroup onValueChange={field.onChange} className="space-y-2 mt-2">
                                              {docItem.choices!.map(choice => (
                                                <div key={choice} className="flex items-center space-x-3">
                                                  <RadioGroupItem value={choice} id={`${docId}-${choice}`} />
                                                  <Label htmlFor={`${docId}-${choice}`} className="font-medium text-gray-600 cursor-pointer">
                                                    {choice}
                                                  </Label>
                                                </div>
                                              ))}
                                            </RadioGroup>
                                          )}
                                        />
                                      </div>
                                    );
                                  } else if (docItem.type === 'required' || docItem.type === 'optional') {
                                    return (
                                      <div key={docIndex} className="flex items-start space-x-3 p-2">
                                        <Controller
                                          name={docId as any}
                                          control={control}
                                          defaultValue={false}
                                          render={({ field }) => (
                                            <Checkbox
                                              id={docId}
                                              checked={!!field.value}
                                              onCheckedChange={field.onChange}
                                              className="mt-1"
                                            />
                                          )}
                                        />
                                        <Label htmlFor={docId} className="font-medium text-gray-700 leading-snug cursor-pointer">
                                          {docItem.type === 'required' && <span className="text-red-500 mr-1">*</span>}
                                          {docItem.text}
                                        </Label>
                                      </div>
                                    );
                                  } else if (docItem.type === 'note') {
                                    return (
                                      <p key={docIndex} className="pl-8 text-sm text-indigo-500/80 italic">{docItem.text}</p>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                <div className="flex justify-center pt-4">
                   <Button
                      type="button"
                      variant="outline"
                      onClick={() => append({ serviceCategory: '', specificService: '', documents: {} })}
                      className="w-full h-12 rounded-xl border-dashed border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-all"
                  >
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Add Another Service
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-8 mt-auto sticky bottom-0 bg-white/70 backdrop-blur-md -mx-8 -mb-8 px-8 pb-8 pt-4 border-t border-gray-100">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => router.back()} 
                  className="rounded-xl text-gray-500 hover:text-gray-900"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                
                <Button 
                  type="submit" 
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 shadow-lg shadow-indigo-200" 
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Confirm Appointment"}
                </Button>
              </div>
            </form>
          </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentDetailsPage() {
  return (
    <Suspense fallback={
      <div className="flex w-full h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    }>
      <AppointmentDetailsForm />
    </Suspense>
  )
}
