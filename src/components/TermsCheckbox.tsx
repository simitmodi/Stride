"use client";

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import {
    Checkbox,
    type CheckboxProps,
} from '@/components/animate-ui/components/radix/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsCheckboxProps {
    checked?: boolean | 'indeterminate';
    onCheckedChange?: (checked: boolean | 'indeterminate') => void;
    variant?: CheckboxProps['variant'];
    size?: CheckboxProps['size'];
}

export const TermsCheckbox = ({
    checked = false,
    onCheckedChange,
    variant,
    size,
}: TermsCheckboxProps) => {
    const [isChecked, setIsChecked] = useState(checked);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const handleCheckedChange = (checked: boolean | 'indeterminate') => {
        setIsChecked(checked);
        if (onCheckedChange) {
            onCheckedChange(checked);
        }
    };

    const handleAgree = () => {
        handleCheckedChange(true);
        setIsOpen(false);
    };

    return (
        <div className="flex items-center gap-x-3">
            <Checkbox
                checked={isChecked}
                onCheckedChange={handleCheckedChange}
                variant={variant}
                size={size}
                id="terms-checkbox"
            />
            <Label htmlFor="terms-checkbox" className="font-normal">
                Accept{' '}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <span className="underline hover:text-primary cursor-pointer text-primary">
                            terms and conditions
                        </span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Terms and Conditions</DialogTitle>
                            <DialogDescription className="text-foreground/80">
                                Please read and accept our terms and conditions to continue.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                            <div className="text-sm space-y-4">
                                <p><strong>1. Acceptance of Terms</strong><br />
                                    By accessing or using Stride, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of the platform.</p>

                                <p><strong>2. Eligibility</strong><br />
                                    Stride services are available only to individuals aged 18 years and above. By using our services, you represent and warrant that you meet this eligibility requirement.</p>

                                <p><strong>3. User Responsibilities</strong><br />
                                    You agree to provide accurate, complete, and up-to-date information during registration and to use the platform solely for lawful purposes related to banking appointments. You are responsible for maintaining the confidentiality of your account credentials.</p>

                                <p><strong>4. Platform Services</strong><br />
                                    Stride enables users to schedule banking appointments, receive reminders, access a personalized dashboard, and track activities via an integrated calendar view. We strive to ensure high availability but do not guarantee uninterrupted service.</p>

                                <p><strong>5. Prohibited Activities</strong><br />
                                    Users must not misuse, manipulate, or overload the appointment system; submit fraudulent documents; interfere with the platform’s functionality; or attempt to gain unauthorized access to our systems.</p>

                                <p><strong>6. Intellectual Property</strong><br />
                                    All content, trademarks, logos, and technology associated with Stride are the exclusive property of the platform. Unauthorized reproduction or usage is strictly prohibited.</p>

                                <p><strong>7. Privacy and Data Security</strong><br />
                                    We are committed to protecting your privacy. Your personal data is processed in accordance with our Privacy Policy. We implement industry-standard security measures to safeguard your information.</p>

                                <p><strong>8. Limitation of Liability</strong><br />
                                    Stride shall not be held liable for bank policies, service delays, cancellations, losses due to unauthorized access, or technical issues beyond its reasonable control. Our liability is limited to the maximum extent permitted by law.</p>

                                <p><strong>9. Termination of Services</strong><br />
                                    Stride reserves the right to suspend or terminate user accounts for violations of these Terms or for any other reason at our sole discretion.</p>

                                <p><strong>10. Governing Law</strong><br />
                                    These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Stride operates, without regard to its conflict of law provisions.</p>

                                <p><strong>11. Changes to Terms</strong><br />
                                    Stride may revise these Terms at any time. Significant updates will be communicated to users. Continued use of the platform constitutes acceptance of the revised terms.</p>
                            </div>
                        </ScrollArea>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button onClick={handleAgree}>Agree</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Label>
        </div>
    );
};
