import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { SignIn, SignUp } from './pages/AuthenticationPages';
import { AddReservation, DeleteReservation } from './pages/ReservationPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Navigate to="/signup" />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <LandingPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reserve"
                        element={
                            <ProtectedRoute>
                                <AddReservation />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/delete"
                        element={
                            <ProtectedRoute>
                                <DeleteReservation />
                            </ProtectedRoute>
                        }
                    />
                    {/* 404 Route */}
                    <Route path="*" element={<h1>404: Not Found</h1>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
