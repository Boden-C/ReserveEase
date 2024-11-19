import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

/**
 * A date picker component that allows selecting a date through a calendar interface
 * @param {Object} props
 * @param {Date} [props.initialDate] - Initial date to display
 * @param {(date: Date) => void} props.onDateChange - Callback when date changes
 * @param {Date} [props.minDate] - Minimum selectable date
 * @param {Date} [props.maxDate] - Maximum selectable date
 * @param {Date} props.value - Current date value
 */
const DatePicker = ({ onDateChange, minDate = new Date(), maxDate, value }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Reset the popover state when value becomes null
    useEffect(() => {
        if (value === null) {
            setIsOpen(false);
        }
    }, [value]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal', !value && 'text-gray-500')}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, 'PPP') : 'Select date'}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(newDate) => {
                        onDateChange(newDate);
                        setIsOpen(false);
                    }}
                    initialFocus
                    fromDate={minDate}
                    toDate={maxDate}
                />
            </PopoverContent>
        </Popover>
    );
};

export default DatePicker;
