
'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import { Separator } from '@/components/ui/separator';
import { Label } from './ui/label';
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from '@/firebase/provider';
import { doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
import { Loader2, Calendar as CalendarIcon, Clock, Pencil, Trash2 } from 'lucide-react';
import { format, addHours, isAfter, isSaturday, isSunday, startOfDay, parse } from 'date-fns';
import { cn } from '@/lib/utils';


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

const DetailItem = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between">
      <dt className="font-semibold text-foreground/80">{label}</dt>
      <dd className="sm:text-right text-foreground">{value || 'N/A'}</dd>
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
  
  // This effect synchronizes the modal's state when a new appointment is passed in.
  useEffect(() => {
    if (isOpen) {
      setNewDate(appointment.date.toDate());
      setNewTime(appointment.time);
      setIsEditing(false); // Reset edit mode when modal reopens for a new appointment
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
      <DialogContent className="max-w-2xl" style={{ backgroundColor: '#D0CBC1' }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary text-center">Appointment Details</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
            {!isEditing ? (
              <>
                <div className="space-y-4 rounded-lg border border-foreground/20 bg-background/5 p-4">
                  <dl className="space-y-3">
                      <DetailItem label="Appointment ID" value={appointment.customAppointmentId} />
                      <DetailItem label="Bank" value={`${appointment.bankName} - ${appointment.branch}`} />
                      <DetailItem label="Address" value={appointment.address} />
                      <DetailItem label="Date & Time" value={`${format(appointment.date.toDate(), 'PPP')} at ${appointment.time}`} />
                      <DetailItem label="Service" value={`${appointment.serviceCategory} - ${appointment.specificService}`} />
                  </dl>
                </div>
                {appointment.confirmedDocuments && appointment.confirmedDocuments.length > 0 && (
                  <div className="space-y-2 rounded-lg border border-foreground/20 bg-background/5 p-4">
                    <h4 className="font-semibold text-foreground/80">Documents to Bring:</h4>
                    <ul className="list-disc list-inside space-y-1 text-foreground">
                        {appointment.confirmedDocuments.map((doc, index) => (
                            <li key={index}>{doc.startsWith('documents.') ? doc.split('.').slice(1).join('.') : doc}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                    <Label style={{ color: '#000F00' }}>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !newDate && 'text-foreground/80'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newDate ? format(newDate, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
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
                    <Label style={{ color: '#000F00' }}>Time</Label>
                    <Select onValueChange={setNewTime} defaultValue={newTime}>
                        <SelectTrigger>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Select a new time slot" />
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
                </div>
              </div>
            )}
        </div>
        <Separator className="bg-primary/20" />
        <DialogFooter className="pt-4 flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <div>
            {isActionable && !isEditing && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Cancel Appointment
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will cancel your appointment. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Back</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Yes, Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            </div>
            <div className='flex justify-end gap-2'>
              {isEditing ? (
                  <>
                      <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button onClick={handleUpdateAppointment} disabled={isUpdating}>
                          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                      </Button>
                  </>
              ) : (
                  <>
                    <DialogClose asChild>
                        <Button variant="secondary">Close</Button>
                    </DialogClose>
                    {isActionable && (
                        <Button onClick={() => setIsEditing(true)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    )}
                  </>
              )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
