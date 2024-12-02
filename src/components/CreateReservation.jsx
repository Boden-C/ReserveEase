import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DatePicker from './date-picker';
import TimePicker from './ui/time-picker/time-picker';

/**
 * Component for adding a new reservation with date and time selection
 * @param {Object} props
 * @param {(reservation: { space_id: string, start_timestamp: Date, end_timestamp: Date }) => Promise<string>} props.onSubmit - Callback when form is submitted
 * @param {boolean} [props.isLoading] - Whether the form is in a loading state
 */
const CreateReservation = ({ onSubmit, isLoading, selectedSpace }) => {
    const [date, setDate] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [errors, setErrors] = useState({
        date: null,
        startTime: null,
        endTime: null,
        form: null,
    });

    const resetForm = () => {
        setDate(null);
        setStartTime('');
        setEndTime('');
        setErrors({
            date: null,
            startTime: null,
            endTime: null,
            form: null,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset all errors
        setErrors({
            date: null,
            startTime: null,
            endTime: null,
            form: null,
        });

        // Validate individual fields
        const newErrors = {};

        if (!date) {
            newErrors.date = 'Please select a date';
        }
        if (!startTime) {
            newErrors.startTime = 'Please select a start time';
        }
        if (!endTime) {
            newErrors.endTime = 'Please select an end time';
        }

        // Create Date objects for the timestamps
        const startHours = startTime.hour;
        const startMinutes = startTime.minute;
        const endHours = endTime.hour;
        const endMinutes = endTime.minute;

        const startTimestamp = new Date(date);
        startTimestamp.setHours(startHours, startMinutes, 0);

        const endTimestamp = new Date(date);
        endTimestamp.setHours(endHours, endMinutes, 0);

        // TIme must be in 15-minute increments
        if (startMinutes % 15 !== 0) {
            newErrors.startTime = 'Time must be in 15-minute increments';
        }
        if (endMinutes % 15 !== 0) {
            newErrors.endTime = 'Time must be in 15-minute increments';
        }
        // Validate time logic
        if (startTimestamp >= endTimestamp) {
            setErrors({
                ...newErrors,
                form: 'End time must be after start time',
            });
            return;
        }

        // If we have any field errors, display them and stop
        if (Object.keys(newErrors).length > 0) {
            setErrors({ ...newErrors });
            return;
        }

        try {
            await onSubmit({
                space_id: selectedSpace,
                start_timestamp: startTimestamp,
                end_timestamp: endTimestamp,
            });

            // Reset form on success
            resetForm();
        } catch (err) {
            setErrors({
                ...errors,
                form: err.message,
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Reservation</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.form && (
                        <Alert variant="destructive">
                            <AlertDescription>{errors.form}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label>Date</Label>
                        <div className={errors.date ? 'border rounded-md border-red-500' : ''}>
                            <DatePicker onDateChange={setDate} minDate={new Date()} value={date} />
                        </div>
                        {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Start Time</Label>
                        <div className={errors.startTime ? 'border rounded-md border-red-500' : ''}>
                            <TimePicker onChange={(time) => setStartTime(time)} value={startTime} />
                        </div>
                        {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>End Time</Label>
                        <div className={errors.endTime ? 'border rounded-md border-red-500' : ''}>
                            <TimePicker onChange={(time) => setEndTime(time)} value={endTime} />
                        </div>
                        {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Reservation'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateReservation;
