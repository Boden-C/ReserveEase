import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, startOfMinute, isBefore } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * DateTimePicker that only allows future dates and 15-minute time increments
 * Defaults to current time rounded down to nearest 15 minutes
 * @param {object} props Component props
 * @param {Date} [props.value] Selected date/time
 * @param {(date?: Date) => void} [props.onChange] Callback when date/time changes
 * @param {string} [props.placeholder] Placeholder text when no date is selected
 * @param {string} [props.className] Additional CSS classes
 */
const FutureDateTimePicker = ({ value, onChange, placeholder = 'Select date and time', className }) => {
    // Floor to nearest 15 minutes
    const floorTo15Minutes = (date) => {
        const minutes = date.getMinutes();
        const remainder = minutes % 15;
        const newDate = new Date(date);
        newDate.setMinutes(minutes - remainder);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        return newDate;
    };

    // Initialize with current time floored to 15 minutes
    const [selectedDate, setSelectedDate] = React.useState(() => {
        const now = new Date();
        const floored = floorTo15Minutes(now);
        return floored;
    });

    // Call onChange with initial value
    React.useEffect(() => {
        if (!value) {
            onChange?.(selectedDate);
        }
    }, [onChange, selectedDate, value]);

    const handleDateSelect = (date) => {
        if (!date) {
            setSelectedDate(undefined);
            onChange?.(undefined);
            return;
        }

        // Preserve existing time if there was a previous selection
        if (selectedDate) {
            date.setHours(selectedDate.getHours(), selectedDate.getMinutes());
        }

        // Ensure we're not setting a past time
        if (isBefore(date, new Date())) {
            const now = new Date();
            const floored = floorTo15Minutes(now);
            date.setHours(floored.getHours(), floored.getMinutes());
            if (isBefore(date, now)) {
                date.setMinutes(date.getMinutes() + 15);
            }
        }

        setSelectedDate(date);
        onChange?.(date);
    };

    const handleTimeChange = (timeValue) => {
        if (!selectedDate) return;

        const [hours, minutes] = timeValue.split(':').map(Number);
        const newDate = new Date(selectedDate);
        newDate.setHours(hours, minutes, 0, 0);

        // Ensure we're not setting a past time
        if (isBefore(newDate, new Date())) {
            const now = new Date();
            const floored = floorTo15Minutes(now);
            newDate.setHours(floored.getHours(), floored.getMinutes());
            if (isBefore(newDate, now)) {
                newDate.setMinutes(newDate.getMinutes() + 15);
            }
        }

        setSelectedDate(newDate);
        onChange?.(newDate);
    };

    // Generate time options in 15-minute increments
    const getTimeOptions = () => {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                options.push({
                    value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
                    label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
                });
            }
        }
        return options;
    };

    const timeOptions = React.useMemo(() => getTimeOptions(), []);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground',
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP HH:mm') : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => isBefore(date, startOfMinute(new Date()))}
                    initialFocus
                />
                <div className="border-t border-border p-3 space-y-2">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <Select
                            value={selectedDate ? format(selectedDate, 'HH:mm') : ''}
                            onValueChange={handleTimeChange}
                        >
                            <SelectTrigger className="w-24">
                                <SelectValue placeholder="Time" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                {timeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default FutureDateTimePicker;
