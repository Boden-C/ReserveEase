import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { NavBar } from '../components/NavBar';
import RightSide from '../components/RightSide';
import CampusMap from '../components/CampusMap';

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

const ReservationsPage = () => {
    const [selectedSpace, setSelectedSpace] = useState(null);

    return (
        <div className="flex flex-col h-screen">
            <NavBar />
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1">
                    <CampusMap selectedSpace={selectedSpace} onSpaceSelect={setSelectedSpace} />
                </div>
                <div className="w-[480px] border-l bg-muted/10">
                    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => setSelectedSpace(null)}>
                        <RightSide selectedSpace={selectedSpace} onSpaceChange={setSelectedSpace} />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default ReservationsPage;
