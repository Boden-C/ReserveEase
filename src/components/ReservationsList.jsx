import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, Trash2 } from 'lucide-react';

/**
 * Component to display a simplified list of user reservations
 * @param {{
 *   reservations: Array<{
 *     reservation_id: string,
 *     space_id: string,
 *     start_timestamp: string,
 *     end_timestamp: string
 *   }>,
 *   isFirstLoad: boolean,
 *   onDelete: (id: string) => Promise<void>
 * }} props
 */
const ReservationsList = ({ reservations, isFirstLoad, onDelete }) => {
    // Only show loading on first load when there's no data
    if (isFirstLoad && reservations.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reservations.map((reservation) => (
                <Card key={reservation.reservation_id} className="overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                                    <h3 className="font-semibold">
                                        {format(new Date(reservation.start_timestamp), 'MMM dd')}{' '}
                                        <span className="text-gray-500">
                                            of {format(new Date(reservation.start_timestamp), 'yyyy')}
                                        </span>
                                    </h3>
                                </div>
                                <div className="flex items-center text-sm text-foreground">
                                    {format(new Date(reservation.start_timestamp), 'HH:mm')} -{' '}
                                    {format(new Date(reservation.end_timestamp), 'HH:mm')}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Space {reservation.space_id} • ID: {reservation.reservation_id}
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(reservation.reservation_id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ReservationsList;
