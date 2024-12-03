import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, ArrowLeft, Loader2 } from 'lucide-react';
import ReservationsList from './ReservationsList';
import CreateReservation from './CreateReservation';
import { useReservations } from '@/components/useReservations';

/**
 * Right side component managing reservations list and creation views
 * @param {Object} props
 * @param {string | null} props.selectedSpace - ID of the selected parking space
 * @returns {JSX.Element}
 * @throws {Error} Throws errors from useReservations for parent error boundary
 */
const RightSide = ({ selectedSpace, onSpaceChange, selectedDateTime }) => {
    const [view, setView] = useState('list');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { reservations, isFirstLoad, addReservation, removeReservation, refreshReservations } = useReservations();

    // Update view when space selection changes
    useEffect(() => {
        if (selectedSpace && selectedSpace != '' && selectedSpace != -1) {
            setView('create');
        } else {
            setView('list');
        }
    }, [selectedSpace]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshReservations();
        } catch (error) {
            throw new Error('Failed to refresh reservations', { cause: error });
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleSubmit = async (reservation) => {
        try {
            await addReservation(reservation);
            onSpaceChange(null);
            setView('list');
            await handleRefresh();
        } catch (error) {
            throw new Error(error.message, { cause: error });
        }
    };

    const handleDelete = async (id) => {
        try {
            await removeReservation(id);
            await handleRefresh();
        } catch (error) {
            throw new Error('Failed to delete reservation', { cause: error });
        }
    };

    const handleBackToList = () => {
        onSpaceChange(null);
        setView('list');
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
                {view === 'list' ? (
                    <>
                        <h2 className="text-xl font-semibold">Your Reservations</h2>
                        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
                            {isRefreshing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCcw className="h-4 w-4" />
                            )}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="ghost" size="icon" onClick={handleBackToList}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-xl font-semibold">Space {selectedSpace}</h2>
                    </>
                )}
            </div>

            <div className="flex-1 overflow-auto p-4">
                {view === 'list' ? (
                    <ReservationsList reservations={reservations} isFirstLoad={isFirstLoad} onDelete={handleDelete} />
                ) : (
                    <CreateReservation
                        onSubmit={handleSubmit}
                        isLoading={isFirstLoad}
                        selectedSpace={selectedSpace}
                        selectedDateTime={selectedDateTime}
                    />
                )}
            </div>
        </div>
    );
};

export default RightSide;
