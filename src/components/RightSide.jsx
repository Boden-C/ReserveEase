import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, ArrowLeft, Loader2 } from 'lucide-react';
import ReservationsList from './reservations-list';
import CreateReservation from './CreateReservation';
import { useReservations } from '@/components/useReservations';

/**
 * @typedef {'list' | 'create'} ViewState
 */

/**
 * Right side component managing reservations list and creation views
 * @param {Object} props
 * @param {string | null} props.selectedSpace - ID of the selected parking space
 * @returns {JSX.Element}
 * @throws {Error} Throws errors from useReservations for parent error boundary
 */
const RightSide = ({ selectedSpace }) => {
    /** @type {[ViewState, (state: ViewState) => void]} */
    const [view, setView] = useState('list');
    /** @type {[boolean, (loading: boolean) => void]} */
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const {
        reservations,
        isFirstLoad,
        addReservation,
        removeReservation,
        refreshReservations
    } = useReservations();

    // Switch to create view when a space is selected
    useEffect(() => {
        if (selectedSpace) {
            setView('create');
        }
    }, [selectedSpace]);

    /**
     * Handles the refresh action with loading state
     * @throws {Error} Throws if refresh fails
     */
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

    /**
     * Handles the reservation creation submission
     * @param {Object} reservation
     * @param {string} reservation.space_id
     * @param {Date} reservation.start_timestamp
     * @param {Date} reservation.end_timestamp
     */
    const handleSubmit = async (reservation) => {
        try {
            await addReservation(reservation);
            setView('list');
            // Refresh the list after successful creation
            await handleRefresh();
        } catch (error) {
            throw new Error('Failed to create reservation', { cause: error });
        }
    };

    /**
     * Handles reservation deletion
     * @param {string} id - Reservation ID to delete
     */
    const handleDelete = async (id) => {
        try {
            await removeReservation(id);
        } catch (error) {
            throw new Error('Failed to delete reservation', { cause: error });
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
                {view === 'list' ? (
                    <>
                        <h2 className="text-xl font-semibold">Your Reservations</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            {isRefreshing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCcw className="h-4 w-4" />
                            )}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setView('list')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>

            <div className="flex-1 overflow-auto p-4">
                {view === 'list' ? (
                    <ReservationsList
                        reservations={reservations}
                        isFirstLoad={isFirstLoad}
                        onDelete={handleDelete}
                    />
                ) : (
                    <CreateReservation
                        onSubmit={handleSubmit}
                        isLoading={isFirstLoad}
                        selectedSpace={selectedSpace}
                    />
                )}
            </div>
        </div>
    );
};

export default RightSide;