import { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { NavBar } from '../components/NavBar';
import RightSide from '../components/RightSide';
import CampusMap from '../components/CampusMap';
import { getParkingWithAvailabilityAt } from '../scripts/api';

/**
 * Error Fallback component for displaying errors
 * @param {{ error: Error, resetErrorBoundary: () => void }} props
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => (
    <Alert variant="destructive" className="mb-4">
        <AlertDescription className="flex justify-between items-center">
            <span>{error.message}</span>
            <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
                Try again
            </Button>
        </AlertDescription>
    </Alert>
);

/**
 * Main reservations page component
 * @returns {JSX.Element} ReservationsPage component
 */
const ReservationsPage = () => {
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [parkingSpaces, setParkingSpaces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [, setError] = useState(null);

    useEffect(() => {
        async function fetchParkingData() {
            if (!selectedDateTime) return;

            setIsLoading(true);
            setError(null);

            try {
                const spaces = await getParkingWithAvailabilityAt(selectedDateTime);
                setParkingSpaces(spaces);
            } catch (err) {
                setError(err.message);
                console.error('Failed to fetch parking data:', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchParkingData();
    }, [selectedDateTime]);

    return (
        <div className="flex flex-col h-screen">
            <NavBar selectedDateTime={selectedDateTime} onDateTimeChange={setSelectedDateTime} />
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1">
                    <ErrorBoundary
                        FallbackComponent={ErrorFallback}
                        onReset={() => {
                            setError(null);
                            setSelectedSpace(null);
                        }}
                    >
                        <CampusMap
                            selectedSpace={selectedSpace}
                            onSpaceSelect={setSelectedSpace}
                            parkingSpaces={parkingSpaces}
                            isLoading={isLoading}
                        />
                    </ErrorBoundary>
                </div>
                <div className="w-[480px] border-l bg-muted/10">
                    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => setSelectedSpace(null)}>
                        <RightSide
                            selectedSpace={selectedSpace}
                            onSpaceChange={setSelectedSpace}
                            selectedDateTime={selectedDateTime}
                            parkingSpaces={parkingSpaces}
                            isLoading={isLoading}
                        />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default ReservationsPage;
