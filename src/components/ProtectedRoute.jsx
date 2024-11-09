/* eslint-disable react/prop-types */
// src/components/ProtectedRoute.jsx
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { validateIdToken } from '../scripts/auth';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await validateIdToken(); // Your existing authentication check
                setIsAuthenticated(true);
            } catch (error) {
                console.error(error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // TODO replace with loading component
    }

    if (!isAuthenticated) {
        // Redirect to signin while saving the attempted URL
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
