import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Component to display a list of user reservations
 * @param {{
 *   reservations: import('../scripts/api').Reservation[],
 *   isLoading: boolean,
 *   error: Error | null,
 *   onDelete: (id: string) => Promise<void>
 * }} props
 */
const ReservationsList = ({ reservations, isLoading, error, onDelete }) => {
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>Error loading reservations: {error.message}</AlertDescription>
            </Alert>
        );
    }

    console.log('now', reservations);

    return (
        <Card className="h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
            <CardHeader>
                <CardTitle>Your Reservations</CardTitle>
                <CardDescription>View and manage your parking reservations</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : reservations.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">No reservations found</div>
                ) : (
                    <div className="space-y-4">
                        {reservations.map((reservation) => (
                            <div key={reservation.reservation_id} className="p-4 border rounded-lg bg-card">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            Reservation: {reservation.reservation_id + '-space' + reservation.space_id}
                                        </h4>
                                        <div className="text-sm text-gray-500 space-y-1">
                                            <p>
                                                Start:{' '}
                                                {format(new Date(reservation.start_timestamp), 'MMM d, yyyy h:mm a')}
                                            </p>
                                            <p>
                                                End: {format(new Date(reservation.end_timestamp), 'MMM d, yyyy h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(reservation.reservation_id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ReservationsList;
