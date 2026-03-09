'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/firebase/provider';
import bankData from '@/lib/ahmedabad_data_with_pincode.json';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, MapPin, Calendar as CalendarLucide, ClipboardList, CheckCircle2, ChevronRight, ChevronLeft, Building, CreditCard, Clock, Loader2, AlertCircle, User, Info, Lightbulb, ShieldCheck } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSaturday, isSunday, startOfDay, isBefore, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Bank = {
  BANK: string;
  IFSC: string;
  BRANCH: string;
  ADDRESS: string;
  pincode: number | null;
};

const formSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required.'),
  pincode: z.string().min(1, 'Pincode is required.'),
  branch: z.string().min(1, 'Branch is required.'),
  address: z.string(),
  accountNumber: z.string().min(10, 'A valid account number is required.').max(16, 'Account number cannot exceed 16 digits.'),
  ifsc: z.string(),
  email: z.string().email(),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.string().min(1, 'Please select a time slot.'),
});

export default function AppointmentSchedulingPage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [banks, setBanks] = useState<string[]>([]);
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [branches, setBranches] = useState<Bank[]>([]);
  
  const [bookedSlots, setBookedSlots] = useState<Record<string, number>>({});
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const MAX_APPOINTMENTS_PER_SLOT = 15;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      bankName: '',
      pincode: '',
      branch: '',
      address: '',
      accountNumber: '',
      ifsc: '',
      email: user?.email || '',
      time: '',
    },
  });

  const { watch, setValue, trigger, formState: { errors } } = form;
  const values = watch();

  useEffect(() => {
    const uniqueBanks = Array.from(new Set(bankData.map((item) => item.BANK))).sort();
    setBanks(uniqueBanks);
  }, []);

  useEffect(() => {
    if (user?.email) {
      setValue('email', user.email);
    }
  }, [user, setValue]);

  useEffect(() => {
    if (values.bankName) {
      const relevantPincodes = Array.from(
        new Set(
          bankData
            .filter((item) => item.BANK === values.bankName && item.pincode)
            .map((item) => item.pincode!.toString())
        )
      ).sort();
      setPincodes(relevantPincodes);
      
      // If we change bank, reset downstream fields
      if (!relevantPincodes.includes(values.pincode)) {
        setValue('pincode', '');
        setValue('branch', '');
        setValue('ifsc', '');
        setValue('address', '');
      }
    } else {
      setPincodes([]);
      setBranches([]);
    }
  }, [values.bankName, setValue, values.pincode]);

  useEffect(() => {
    if (values.bankName && values.pincode.length >= 6) {
      const filteredBranches = bankData.filter(
        (item) =>
          item.BANK === values.bankName &&
          item.pincode?.toString() === values.pincode
      );
      setBranches(filteredBranches);
      if (!filteredBranches.find(b => b.BRANCH === values.branch)) {
        setValue('branch', '');
        setValue('ifsc', '');
        setValue('address', '');
      }
    } else {
      setBranches([]);
    }
  }, [values.bankName, values.pincode, setValue, values.branch]);

  useEffect(() => {
    if (values.branch) {
      const branchDetails = branches.find(
        (b) => b.BRANCH === values.branch
      );
      if (branchDetails) {
        setValue('ifsc', branchDetails.IFSC);
        setValue('address', branchDetails.ADDRESS);
      }
    }
  }, [values.branch, branches, setValue]);

  // Real-time Slot Availability Checker
  useEffect(() => {
    async function fetchAvailability() {
      if (!values.branch || !values.date) {
        setBookedSlots({});
        return;
      }
      setIsFetchingSlots(true);
      try {
        const dateStart = startOfDay(values.date);
        const dateEnd = addDays(dateStart, 1);

        const appointmentsRef = collection(db, 'appointments');
        const q = query(
          appointmentsRef,
          where('branch', '==', values.branch),
          where('date', '>=', Timestamp.fromDate(dateStart)),
          where('date', '<', Timestamp.fromDate(dateEnd))
        );

        const snapshot = await getDocs(q);
        const counts: Record<string, number> = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.time) {
            counts[data.time] = (counts[data.time] || 0) + 1;
          }
        });
        setBookedSlots(counts);
      } catch (err) {
        console.error("Error fetching slot availability:", err);
      } finally {
        setIsFetchingSlots(false);
      }
    }

    fetchAvailability();
  }, [values.branch, values.date]);
  
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 10; i < 16; i++) {
        if (i === 14) continue; 
  
        const formatHour12 = (hour: number) => {
            const h = hour % 12 === 0 ? 12 : hour % 12;
            return h < 10 ? `0${h}` : h.toString();
        };
        const getAmPm = (hour: number) => (hour < 12 ? 'AM' : 'PM');
  
        const startHour = i;
        const endHour = i;
        const startMinutes = '00';
        const endMinutes = '30';
  
        const startAmPm = getAmPm(startHour);
        const endAmPm = getAmPm(endHour);
  
        slots.push(`${formatHour12(startHour)}:${startMinutes} ${startAmPm} - ${formatHour12(endHour)}:${endMinutes} ${endAmPm}`);
  
        if (i < 15) { 
            if (i === 13) continue;

            const nextStartHour = i + 1;
            const nextStartMinutes = '00';
            const nextStartAmPm = getAmPm(nextStartHour);
  
            slots.push(`${formatHour12(endHour)}:${endMinutes} ${endAmPm} - ${formatHour12(nextStartHour)}:${nextStartMinutes} ${nextStartAmPm}`);
        }
    }
    return slots;
  }, []);

  const isBankHoliday = (date: Date) => {
    if (isSunday(date)) return true;
    if (isSaturday(date)) {
      const dayOfMonth = date.getDate();
      if ((dayOfMonth > 7 && dayOfMonth <= 14) || (dayOfMonth > 21 && dayOfMonth <= 28)) {
        return true;
      }
    }
    return false;
  };
  
  const isDateDisabled = (date: Date): boolean => {
    const now = new Date();
    const today = startOfDay(now);
    const dateStart = startOfDay(date);
    
    if (isBefore(dateStart, today)) return true;

    if (isBefore(dateStart, startOfDay(addDays(today,1))) && isBefore(startOfDay(addDays(dateStart,1)),startOfDay(addDays(today,1)))) {
        if (now.getHours() >= 8) return true;
    }
    
    if (isBankHoliday(date)) return true;
    return false;
  };

  const handleNext = async () => {
    let fieldsToValidate: any = [];
    if (step === 1) fieldsToValidate = ['bankName', 'pincode', 'branch'];
    if (step === 2) fieldsToValidate = ['date', 'time'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const query = new URLSearchParams({
      bankName: data.bankName,
      branch: data.branch,
      address: data.address,
      date: data.date.toISOString(),
      time: data.time,
      accountNumber: data.accountNumber,
    }).toString();
    router.push(`/dashboard/customer/appointment-scheduling/appointment-details?${query}`);
  };

  const stepVariants: any = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

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
        
        {/* ── Main Wizard Area ── */}
        <div className="w-full max-w-3xl flex flex-col h-full">
          <TypographyHeader step={step} />

          <div className="relative overflow-y-auto no-scrollbar rounded-[2rem] border border-gray-100 bg-white/70 shadow-2xl backdrop-blur-xl p-8 flex-1 flex flex-col">
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 h-full">
            <AnimatePresence mode="wait">
              {/* STEP 1: Location */}
              {step === 1 && (
                <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex-1 space-y-8">
                  <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                    <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Branch Location</h2>
                      <p className="text-sm text-gray-500">Select where you'd like to schedule your visit.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="bankName" className="text-gray-700 font-semibold">Select Your Bank</Label>
                      <Controller
                        name="bankName"
                        control={form.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 hover:bg-white transition-colors">
                              <SelectValue placeholder="Select a bank" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl">
                              {banks.map((bank) => (
                                <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.bankName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.bankName.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="pincode" className="text-gray-700 font-semibold">Area Pincode</Label>
                        <Controller
                          name="pincode"
                          control={form.control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={!values.bankName}>
                              <SelectTrigger className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 disabled:opacity-50 hover:bg-white transition-colors">
                                <SelectValue placeholder="Select area code" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl">
                                {pincodes.map((pin) => (
                                  <SelectItem key={pin} value={pin}>{pin}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.pincode && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.pincode.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="branch" className="text-gray-700 font-semibold">Home Branch</Label>
                        <Controller
                          name="branch"
                          control={form.control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={!values.pincode || branches.length === 0}>
                              <SelectTrigger className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 disabled:opacity-50 hover:bg-white transition-colors">
                                <SelectValue placeholder={!values.pincode ? "Select pincode first" : "Choose your branch"} />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl">
                                {branches.map((b) => (
                                  <SelectItem key={b.IFSC} value={b.BRANCH}>{b.BRANCH}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.branch && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.branch.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Decorative Info Box for Step 1 */}
                  <div className="mt-8 bg-indigo-50/50 border border-indigo-100/50 text-indigo-700 p-6 rounded-2xl flex gap-4 items-start transition-all hover:bg-indigo-50">
                    <Info className="w-6 h-6 shrink-0 text-indigo-500" />
                    <div>
                      <h4 className="font-semibold mb-1">Choosing your branch</h4>
                      <p className="text-sm leading-relaxed text-indigo-600/80">
                        For standard banking services, any branch can assist you. However, for specific account operations, your home branch will offer the fastest processing times.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Date & Time */}
              {step === 2 && (
                <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex-1 space-y-8">
                  <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                    <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                      <CalendarLucide className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Date & Time</h2>
                      <p className="text-sm text-gray-500">Pick an available appointment slot.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold">Select Date</Label>
                      <Controller
                        name="date"
                        control={form.control}
                        render={({ field }) => (
                          <div className="p-4 rounded-3xl border border-gray-200 bg-gray-50/50">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(val) => {
                                field.onChange(val);
                                setValue('time', ''); // Reset time when date changes
                              }}
                              disabled={isDateDisabled}
                              className="rounded-xl w-full flex justify-center bg-transparent"
                            />
                          </div>
                        )}
                      />
                      {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold">Available Time Slots</Label>
                      {!values.date ? (
                        <div className="h-full min-h-[250px] rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                          <Clock className="h-8 w-8 mb-3 opacity-50" />
                          <p className="text-sm font-medium">Please select a date first to view available time slots.</p>
                        </div>
                      ) : isFetchingSlots ? (
                        <div className="h-full min-h-[250px] rounded-3xl border border-gray-100 bg-gray-50/50 flex flex-col items-center justify-center text-indigo-500">
                          <Loader2 className="h-8 w-8 animate-spin mb-3" />
                          <p className="text-sm font-medium">Checking live availability...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto px-2 pt-2 pb-6 no-scrollbar">
                          {timeSlots.map(slot => {
                            const bookingsCount = bookedSlots[slot] || 0;
                            const isFull = bookingsCount >= MAX_APPOINTMENTS_PER_SLOT;
                            const isSelected = values.time === slot;

                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled={isFull}
                                onClick={() => setValue('time', slot, { shouldValidate: true })}
                                className={cn(
                                  "relative w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all duration-200 border",
                                  isFull ? "bg-red-50/30 border-red-100 opacity-60 cursor-not-allowed" : 
                                  isSelected ? "bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-200 text-white" : "bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-gray-700"
                                )}
                              >
                                <div className="font-semibold text-sm">{slot}</div>
                                {isFull ? (
                                  <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded-full">FULL</span>
                                ) : (
                                  <span className={cn("text-xs font-medium px-2 py-1 rounded-full", isSelected ? "bg-indigo-500/30 text-white" : "text-emerald-600 bg-emerald-50")}>
                                    {MAX_APPOINTMENTS_PER_SLOT - bookingsCount} left
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {errors.time && <p className="text-sm text-red-500">{errors.time.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Details */}
              {step === 3 && (
                <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex-1 space-y-8">
                   <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                    <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                      <ClipboardList className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
                      <p className="text-sm text-gray-500">Provide final details to complete scheduling.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber" className="text-gray-700 font-semibold">Bank Account Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                          id="accountNumber" 
                          placeholder="Enter your 10-16 digit account number" 
                          {...form.register('accountNumber')} 
                          className="h-14 rounded-2xl border-gray-200 bg-white px-12 focus:ring-4 focus:ring-indigo-500/10 text-lg tracking-widest"
                        />
                      </div>
                      {errors.accountNumber && <p className="text-sm text-red-500">{errors.accountNumber.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-semibold">Contact Email</Label>
                        <Input 
                          id="email" 
                          {...form.register('email')} 
                          readOnly 
                          className="h-14 rounded-2xl border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifsc" className="text-gray-700 font-semibold">IFSC Code (Auto-filled)</Label>
                        <Input 
                          id="ifsc" 
                          {...form.register('ifsc')} 
                          readOnly 
                          className="h-14 rounded-2xl border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Info Box for Step 3 */}
                  <div className="mt-8 bg-emerald-50/50 border border-emerald-100/50 text-emerald-700 p-6 rounded-2xl flex gap-4 items-start transition-all hover:bg-emerald-50">
                    <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-500" />
                    <div>
                      <h4 className="font-semibold mb-1">Secure & Confidential</h4>
                      <p className="text-sm leading-relaxed text-emerald-600/80">
                        Your account security is our top priority. We use industry-standard encryption to transmit this appointment request securely to your selected branch manager.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Wizard Controls ── */}
            <div className="mt-auto pt-8 flex items-center justify-between border-t border-gray-100">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1}
                className={cn("rounded-xl h-12 px-6 font-semibold", step === 1 ? "opacity-0 invisible" : "text-gray-500 hover:bg-gray-100")}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>

              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={cn("h-2 rounded-full transition-all duration-300", step === s ? "w-8 bg-indigo-600" : "w-2 bg-gray-200")} />
                ))}
              </div>

              {step < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 font-semibold transition-all group"
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="rounded-xl h-12 px-8 bg-gray-900 hover:bg-black text-white shadow-lg shadow-gray-300 font-semibold transition-all group"
                >
                  Book Appointment <CheckCircle2 className="ml-2 h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ── Persistent Summary Panel ── */}
      <div className="hidden md:block w-80 lg:w-[400px]">
        <div className="sticky top-8 rounded-[2rem] bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 shadow-2xl h-auto overflow-hidden">
          {/* Abstract background blobs */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-indigo-400" /> Appointment Summary
            </h3>

            <div className="relative space-y-8 flex-1 pl-4">
              {/* Vertical connecting line */}
              <div className="absolute left-[35px] top-10 bottom-12 w-[2px] bg-gradient-to-b from-indigo-500/50 via-white/20 to-transparent shadow-sm" />

              <SummaryItem 
                icon={<Building className="h-5 w-5 text-indigo-300" />} 
                title="Branch Location" 
                value={values.branch || "Not selected yet"} 
                subValue={values.address}
                isActive={step >= 1} 
              />
              
              <SummaryItem 
                icon={<CalendarIcon className="h-5 w-5 text-indigo-300" />} 
                title="Date & Time" 
                value={values.date ? format(values.date, 'EEEE, MMM d, yyyy') : "No date picked"} 
                subValue={values.time || "No time selected"}
                isActive={step >= 2} 
              />

              <SummaryItem 
                icon={<User className="h-5 w-5 text-indigo-300" />} 
                title="Account Identity" 
                value={values.accountNumber ? `A/C ending in ...${values.accountNumber.slice(-4)}` : "Pending details"} 
                subValue={values.email}
                isActive={step >= 3} 
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

// Helper components
function TypographyHeader({ step }: { step: number }) {
  const titles = [
    "Select Your Branch",
    "Choose Date & Time",
    "Finalize Booking"
  ];
  return (
    <div className="mb-8 pl-4">
      <p className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-2 animate-pulse">Step {step} of 3</p>
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{titles[step-1]}</h1>
    </div>
  );
}

function SummaryItem({ icon, title, value, subValue, isActive }: { icon: React.ReactNode, title: string, value: string, subValue?: string, isActive: boolean }) {
  return (
    <div className={cn("relative flex gap-5 transition-all duration-300 z-10", isActive ? "opacity-100" : "opacity-40")}>
      <div className={cn("mt-1 w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 shadow-lg backdrop-blur-md transition-all duration-500", isActive ? "bg-indigo-600/80 border-indigo-400" : "bg-white/10 border-white/20")}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-indigo-200 uppercase tracking-widest mb-1">{title}</p>
        <p className="font-medium text-white text-md tracking-wide">{value}</p>
        {subValue && <p className="text-sm text-indigo-100/70 mt-1 line-clamp-2">{subValue}</p>}
      </div>
    </div>
  );
}

// Stride: Professional Financial Connectivity
