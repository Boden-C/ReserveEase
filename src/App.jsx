import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { AuthProvider } from './components/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';

import DashboardPage from './pages/DashboardPage';
import Signin from './pages/SigninPage';
import SignUp from './pages/SignupPage';
import { NavBar } from './components/NavBar';

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <AuthProvider>
                <Router>
                    {/* Navbar displayed for all routes except SignIn and SignUp */}
                    <Routes>
                        <Route
                            path="*"
                            element={
                                <>
                                    {window.location.pathname !== '/signin' &&
                                        window.location.pathname !== '/signup' && <NavBar />}
                                    <Routes>
                                        {/* Public Routes */}
                                        <Route path="/" element={<Navigate to="/signup" />} />
                                        <Route path="/signup" element={<SignUp />} />
                                        <Route path="/signin" element={<Signin />} />

                                        {/* Private Routes */}
                                        <Route
                                            path="/dashboard"
                                            element={
                                                <PrivateRoute>
                                                    <DashboardPage />
                                                </PrivateRoute>
                                            }
                                        />

                                        {/* Test Route */}
                                        <Route path="/test" element={<Signin />} />

                                        {/* 404 Route */}
                                        <Route path="*" element={<h1>404: Not Found</h1>} />
                                    </Routes>
                                </>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
