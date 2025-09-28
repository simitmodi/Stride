
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/firebase/provider';
import bankData from '@/lib/ahmedabad_data_with_pincode.json';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Bank = {
  BANK: string;
  IFSC: string;
  BRANCH: string;
  pincode: number | null;
};

const formSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required.'),
  pincode: z.string().min(1, 'Pincode is required.'),
  branch: z.string().min(1, 'Branch is required.'),
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
  
  const [banks, setBanks] = useState<string[]>([]);
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [branches, setBranches] = useState<Bank[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankName: '',
      pincode: '',
      branch: '',
      accountNumber: '',
      ifsc: '',
      email: user?.email || '',
      time: '',
    },
  });

  const { watch, setValue, reset } = form;
  const selectedBank = watch('bankName');
  const enteredPincode = watch('pincode');
  const selectedBranch = watch('branch');

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
    if (selectedBank) {
      const relevantPincodes = Array.from(
        new Set(
          bankData
            .filter((item) => item.BANK === selectedBank && item.pincode)
            .map((item) => item.pincode!.toString())
        )
      ).sort();
      setPincodes(relevantPincodes);
      setValue('pincode', '');
      setValue('branch', '');
      setValue('ifsc', '');
    } else {
      setPincodes([]);
      setBranches([]);
    }
  }, [selectedBank, setValue]);

  useEffect(() => {
    if (selectedBank && enteredPincode.length >= 6) {
      const filteredBranches = bankData.filter(
        (item) =>
          item.BANK === selectedBank &&
          item.pincode?.toString() === enteredPincode
      );
      setBranches(filteredBranches);
      setValue('branch', '');
      setValue('ifsc', '');
    } else {
      setBranches([]);
    }
  }, [selectedBank, enteredPincode, setValue]);

  useEffect(() => {
    if (selectedBranch) {
      const branchDetails = branches.find(
        (b) => b.BRANCH === selectedBranch
      );
      if (branchDetails) {
        setValue('ifsc', branchDetails.IFSC);
      }
    }
  }, [selectedBranch, branches, setValue]);
  
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 10; i < 17; i++) {
        if (i === 14) continue; // Skip 14:00 - 15:00 (2 PM hour)
  
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
  
        if (i < 16) {
            // Skip 13:30 - 14:00 (1:30 PM - 2:00 PM) slot
            if (i === 13) continue;

            const nextStartHour = i + 1;
            const nextStartMinutes = '00';
            const nextStartAmPm = getAmPm(nextStartHour);
  
            slots.push(`${formatHour12(endHour)}:${endMinutes} ${endAmPm} - ${formatHour12(nextStartHour)}:${nextStartMinutes} ${nextStartAmPm}`);
        }
    }
    return slots;
  }, []);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    toast({
      title: 'Form Validated!',
      description: 'Navigating to appointment details...',
    });
    router.push('/dashboard/customer/appointment-scheduling/appointment-details');
  };

  const handleReset = () => {
    reset({
      bankName: '',
      pincode: '',
      branch: '',
      accountNumber: '',
      ifsc: '',
      email: user?.email || '',
      date: undefined,
      time: '',
    });
    setPincodes([]);
    setBranches([]);
  };

  return (
    <div className="flex w-full flex-col items-center p-4 md:p-8" style={{ backgroundColor: '#BFBAB0' }}>
      <Card className="w-full max-w-2xl shadow-lg" style={{ backgroundColor: '#D0CBC1' }}>
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold" style={{ color: '#092910' }}>
            Appointment Scheduling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Bank */}
              <div className="space-y-2">
                <Label htmlFor="bankName" style={{ color: '#000F00' }}>Select Your Bank:</Label>
                <Controller
                  name="bankName"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {banks.map((bank) => (
                          <SelectItem key={bank} value={bank}>
                            {bank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                 {form.formState.errors.bankName && <p className="text-sm text-destructive">{form.formState.errors.bankName.message}</p>}
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <Label htmlFor="pincode" style={{ color: '#000F00' }}>Pincode:</Label>
                <Controller
                  name="pincode"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedBank}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pincode" />
                      </SelectTrigger>
                      <SelectContent>
                        {pincodes.map((pincode) => (
                          <SelectItem key={pincode} value={pincode}>
                            {pincode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.pincode && <p className="text-sm text-destructive">{form.formState.errors.pincode.message}</p>}
              </div>

              {/* Branches */}
              <div className="space-y-2">
                <Label htmlFor="branch" style={{ color: '#000F00' }}>Branches Available:</Label>
                <Controller
                  name="branch"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={!enteredPincode || branches.length === 0}>
                      <SelectTrigger>
                        <SelectValue placeholder="First select a Bank & Pincode" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((b) => (
                          <SelectItem key={b.IFSC} value={b.BRANCH}>
                            {b.BRANCH}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                 {form.formState.errors.branch && <p className="text-sm text-destructive">{form.formState.errors.branch.message}</p>}
              </div>
              
              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber" style={{ color: '#000F00' }}>Bank Account Number:</Label>
                <Input id="accountNumber" placeholder="Enter 16 digit account number" {...form.register('accountNumber')} />
                {form.formState.errors.accountNumber && <p className="text-sm text-destructive">{form.formState.errors.accountNumber.message}</p>}
              </div>

              {/* IFSC Code */}
              <div className="space-y-2">
                <Label htmlFor="ifsc" style={{ color: '#000F00' }}>IFSC Code:</Label>
                <Input id="ifsc" {...form.register('ifsc')} disabled className="bg-gray-200" />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: '#000F00' }}>Email:</Label>
                <Input id="email" placeholder="eg. abc@example.com" {...form.register('email')} readOnly={!!user?.email} className={user?.email ? "bg-gray-200" : ""} />
                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
              </div>

              {/* Date */}
               <div className="space-y-2">
                <Label htmlFor="date" style={{ color: '#000F00' }}>Date:</Label>
                 <Controller
                    name="date"
                    control={form.control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-foreground/80 hover:text-[#FFF0FF]'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : <span style={!field.value ? {color: '#000F00'} : {}}>Enter Date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {form.formState.errors.date && <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>}
               </div>
              
              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time" style={{ color: '#000F00' }}>Time:</Label>
                <Controller
                  name="time"
                  control={form.control}
                  render={({ field }) => (
                     <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select Time Slot" />
                          </div>
                        </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                                {slot}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                 {form.formState.errors.time && <p className="text-sm text-destructive">{form.formState.errors.time.message}</p>}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Button type="button" variant="outline" onClick={handleReset} className="w-32">
                Reset
              </Button>
              <Button type="submit" className="w-32">
                Next
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
