
'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from '@/firebase/provider';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { format, addHours, isAfter, isSaturday, isSunday, startOfDay, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, Pencil, Trash2, Loader2, Info } from 'lucide-react';

interface AppointmentData {
  id: string;
  customAppointmentId: string;
  bankName: string;
  branch: string;
  date: Timestamp;
  time: string;
  serviceCategory: string;
  specificService: string;
  confirmedDocuments?: string[];
  address?: string;
  deleted?: boolean;
}

interface CustomerAppointmentDetailsModalProps {
  appointment: AppointmentData;
  isOpen: boolean;
  onClose: () => void;
  onAppointmentUpdate: (appointment: AppointmentData) => void;
  onAppointmentCancel: (appointmentId: string) => void;
}

const DetailItem = ({ label, value, icon: Icon }: { label: string; value: string | undefined; icon?: any }) => (
    <div className="grid grid-cols-[120px_1fr] items-start gap-4 py-2 border-b border-[#5927bb]/5 last:border-0 group">
      <dt className="text-[13px] font-bold text-[#5927bb]/70 flex items-center gap-2 pt-0.5">
        {Icon && <Icon className="w-3.5 h-3.5 opacity-80" />}
        {label}
      </dt>
      <dd className="text-[15px] font-semibold text-foreground/90 leading-relaxed tracking-tight group-hover:text-[#5927bb] transition-colors">
        {value || 'N/A'}
      </dd>
    </div>
);

export function CustomerAppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
  onAppointmentUpdate,
  onAppointmentCancel
}: CustomerAppointmentDetailsModalProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [newDate, setNewDate] = useState<Date | undefined>(() => appointment.date.toDate());
  const [newTime, setNewTime] = useState(appointment.time);
  
  useEffect(() => {
    if (isOpen) {
      setNewDate(appointment.date.toDate());
      setNewTime(appointment.time);
      setIsEditing(false);
    }
  }, [isOpen, appointment]);


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

  const handleUpdateAppointment = async () => {
    if (!newTime || !newDate) return;
    setIsUpdating(true);
    try {
      const appointmentDocRef = doc(firestore, "appointments", appointment.id);
      await updateDoc(appointmentDocRef, {
        time: newTime,
        date: Timestamp.fromDate(newDate)
      });
      
      const updatedAppointment = { ...appointment, time: newTime, date: Timestamp.fromDate(newDate) };
      onAppointmentUpdate(updatedAppointment);
      
      toast({
        title: "Appointment Updated",
        description: "Your appointment has been successfully rescheduled.",
      });
      setIsEditing(false);
      onClose();

    } catch (error: any) {
      console.error("Error updating appointment:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update the appointment.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const appointmentDocRef = doc(firestore, "appointments", appointment.id);
      await updateDoc(appointmentDocRef, { deleted: true });
      
      onAppointmentCancel(appointment.id);
      
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
      onClose();

    } catch (error: any) {
      console.error("Error cancelling appointment:", error);
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: error.message || "Could not cancel the appointment.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isBankHoliday = (date: Date) => {
    if (isSunday(date)) return true;
    if (isSaturday(date)) {
      const dayOfMonth = date.getDate();
      if ((dayOfMonth > 7 && dayOfMonth <= 14) || (dayOfMonth > 21 && dayOfMonth <= 28)) return true;
    }
    return false;
  };
  
  const appointmentDateTime = parse(
      `${format(appointment.date.toDate(), 'yyyy-MM-dd')} ${appointment.time.split(' - ')[0]}`,
      'yyyy-MM-dd h:mm a',
      new Date()
  );

  const now = new Date();
  const twelveHoursFromNow = addHours(now, 12);
  const isActionable = isAfter(appointmentDateTime, twelveHoursFromNow);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[68vw] max-w-[95vw] p-0 overflow-hidden border-none bg-[#f8f9fc] rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] antialiased">
        <div className="relative p-6 sm:p-8 flex flex-col">
          <DialogHeader className="mb-4 relative">
            <DialogTitle className="text-3xl font-extrabold tracking-tight text-center text-[#5927bb]">
              Appointment Details
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div 
                key="details"
                initial={{ opacity: 0, scale: 0.99, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 flex flex-col gap-4"
              >
                {/* Appointment ID - Full Width */}
                <div className="p-4 sm:p-5 rounded-[2rem] bg-white border border-black/5 shadow-sm">
                  <DetailItem label="Appointment ID" value={appointment.customAppointmentId} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Details Box */}
                  <div className="p-5 sm:p-6 rounded-[2rem] bg-white border border-black/5 shadow-sm">
                    <DetailItem label="Bank" value={appointment.bankName} />
                    <DetailItem label="Address" value={appointment.address} />
                    <DetailItem 
                      label="Date & Time" 
                      value={`${format(appointment.date.toDate(), 'MMMM do, yyyy')} at ${appointment.time}`} 
                    />
                    <DetailItem label="Service" value={`${appointment.serviceCategory} - ${appointment.specificService}`} />
                  </div>

                  {/* Documents Box */}
                  {appointment.confirmedDocuments && appointment.confirmedDocuments.length > 0 && (
                    <div className="p-5 sm:p-6 rounded-[2rem] bg-white border border-black/5 shadow-sm">
                      <h4 className="font-bold text-[#4a5568] text-base mb-3">Documents to Bring:</h4>
                      <ul className="space-y-2">
                        {appointment.confirmedDocuments.map((doc, index) => (
                          <li key={index} className="flex items-start gap-3 text-[15px] font-medium text-foreground/80 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-black/60 mt-2 shrink-0" />
                            <span className="break-words">{doc.startsWith('documents.') ? doc.split('.').slice(1).join('.') : doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="editing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-5 p-7 rounded-[1.5rem] bg-muted/30 border-2 border-[#5927bb]/10">
                  <div className="space-y-2">
                    <Label className="text-[#5927bb] font-bold text-sm ml-1">Reschedule Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-medium rounded-2xl h-14 border-[#5927bb]/20 hover:border-[#5927bb] hover:bg-[#5927bb]/5 transition-all shadow-sm px-5',
                              !newDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-3 h-5 w-5 text-[#5927bb]" />
                            {newDate ? format(newDate, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-[1.5rem] border-none shadow-2xl overflow-hidden" align="start">
                          <Calendar
                            mode="single"
                            selected={newDate}
                            onSelect={setNewDate}
                            initialFocus
                            disabled={(date) => date < startOfDay(new Date()) || isBankHoliday(date)}
                          />
                        </PopoverContent>
                      </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#5927bb] font-bold text-sm ml-1">Preferred Time</Label>
                    <Select onValueChange={setNewTime} defaultValue={newTime}>
                        <SelectTrigger className="rounded-2xl h-14 border-[#5927bb]/20 hover:border-[#5927bb] hover:bg-[#5927bb]/5 transition-all shadow-sm px-5">
                            <div className="flex items-center">
                                <Clock className="mr-3 h-5 w-5 text-[#5927bb]" />
                                <SelectValue placeholder="Select a new time slot" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-xl max-h-[300px]">
                            {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot} className="rounded-xl py-3 focus:bg-[#5927bb]/10">
                                    {slot}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
              {!isEditing ? (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        disabled={isDeleting}
                        className="bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-2xl px-6 h-12 font-bold shadow-lg shadow-red-500/20 transition-all active:scale-95 flex items-center gap-2"
                      >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Cancel Appointment
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[2rem] border-none p-10 shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black text-[#5927bb]">Cancel Appointment?</AlertDialogTitle>
                        <AlertDialogDescription className="text-lg font-medium">
                          Are you sure? This action will permanently remove your scheduled slot.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-8">
                        <AlertDialogCancel className="rounded-2xl h-12 px-8 font-bold border-2 border-muted hover:bg-muted/50 transition-all">Go Back</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          className="bg-red-500 hover:bg-red-600 rounded-2xl h-12 px-8 font-bold shadow-lg shadow-red-500/20 transition-all"
                        >
                          Confirm Cancellation
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      onClick={onClose}
                      className="bg-white rounded-2xl px-8 h-12 border border-black/10 hover:bg-black/5 font-bold transition-all text-black/70"
                    >
                      Close
                    </Button>
                    {isActionable && (
                        <Button 
                          onClick={() => setIsEditing(true)}
                          className="bg-[#5927bb] hover:bg-[#5927bb]/90 text-white rounded-2xl px-10 h-12 font-bold shadow-lg shadow-[#5927bb]/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-end w-full gap-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsEditing(false)}
                    className="rounded-2xl px-8 h-12 font-bold hover:bg-red-50 text-red-500 transition-all"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateAppointment} 
                    disabled={isUpdating}
                    className="bg-[#5927bb] hover:bg-[#5927bb]/90 text-white rounded-2xl px-10 h-12 font-bold shadow-lg shadow-[#5927bb]/20 transition-all active:scale-95"
                  >
                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
}

// Stride: Professional Financial Connectivity
