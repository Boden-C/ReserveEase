import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { NavBar } from '../components/NavBar';
import RightSide from '../components/RightSide';

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

    const handleSpaceClick = () => {
        // Simulate selecting a space with ID "A1"
        setSelectedSpace(selectedSpace ? null : "A1");
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Navigation Bar */}
            <NavBar />

            {/* Content area - will take remaining height */}
            <div className="flex flex-1 overflow-hidden">
                {/* Main content area */}
                <div className="flex-1 p-4 overflow-auto">
                    <Button 
                        className="w-64"
                        variant={selectedSpace ? "destructive" : "default"}
                        onClick={handleSpaceClick}
                    >
                        {selectedSpace ? "Deselect Space A1" : "Select Space A1"}
                    </Button>
                </div>

                {/* Right side panel */}
                <div className="w-[480px] border-l bg-muted/10 overflow-auto">
                    <ErrorBoundary 
                        FallbackComponent={ErrorFallback}
                        onReset={() => setSelectedSpace(null)}
                    >
                        <RightSide selectedSpace={selectedSpace} />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default ReservationsPage;