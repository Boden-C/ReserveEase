import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import TimeGrid from './TimeGrid';
import { format } from 'date-fns';
import { useReservations } from '@/components/useReservations';

const CreateReservation = ({ onSubmit, isLoading, selectedSpace, selectedDateTime }) => {
    const [error, setError] = useState(null);
    const [selection, setSelection] = useState({ start: null, end: null });
    const { reservations, isFirstLoad } = useReservations();
    const errorRef = useRef(null);

    // Convert reservations to time slots format expected by TimeGrid
    const reservedSlots = reservations
        .filter((res) => res.space_id === selectedSpace)
        .map((res) => ({
            start: new Date(res.start_timestamp),
            end: new Date(res.end_timestamp),
        }));

    const handleSelectionChange = (start, end) => {
        setError(null);
        setSelection({ start, end });
    };

    const handleSubmit = async () => {
        if (!selection.start || !selection.end) {
            setError('Please select a time slot');
            return;
        }

        try {
            await onSubmit({
                space_id: selectedSpace,
                start_timestamp: selection.start,
                end_timestamp: selection.end,
            });
            setSelection({ start: null, end: null });
        } catch (err) {
            setError(err.message);
            errorRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (isFirstLoad) {
        return <div>Loading reservations...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Reservation for {format(selectedDateTime, 'MMMM d, yyyy')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={errorRef}>
                    {' '}
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <TimeGrid
                    selectedDate={selectedDateTime || new Date()}
                    reservedSlots={reservedSlots}
                    onSelectionChange={handleSelectionChange}
                    selectedSpace={selectedSpace}
                />

                <div className="mt-6">
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !selection.start || !selection.end}
                        className="w-full"
                    >
                        {isLoading ? 'Adding...' : 'Add Reservation'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CreateReservation;
