"use client";

import { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import {
    Checkbox,
    type CheckboxProps,
} from '@/components/animate-ui/components/radix/checkbox';

import Link from 'next/link';

interface RadixCheckboxDemoProps {
    checked?: boolean | 'indeterminate';
    onCheckedChange?: (checked: boolean | 'indeterminate') => void;
    variant?: CheckboxProps['variant'];
    size?: CheckboxProps['size'];
}

export const RadixCheckboxDemo = ({
    checked = false,
    onCheckedChange,
    variant,
    size,
}: RadixCheckboxDemoProps) => {
    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const handleCheckedChange = (checked: boolean | 'indeterminate') => {
        setIsChecked(checked);
        if (onCheckedChange) {
            onCheckedChange(checked);
        }
    };

    return (
        <Label className="flex items-center gap-x-3">
            <Checkbox
                checked={isChecked}
                onCheckedChange={handleCheckedChange}
                variant={variant}
                size={size}
            />
            <span>
                Accept{' '}
                <Link href="/terms" className="underline hover:text-primary">
                    terms and conditions
                </Link>
            </span>
        </Label>
    );
};
