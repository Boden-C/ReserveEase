import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from './AuthContext';

export function NavBar() {
    const navigate = useNavigate();
    const { signout } = useAuth();

    const handleSignOut = async () => {
        try {
            await signout();
            navigate('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-gray-800">ReserveEase</span>
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <Button
                            variant="ghost"
                            className="text-gray-700 hover:bg-gray-300"
                            onClick={handleSignOut} // Attach the sign-out logic
                        >
                            Sign out
                        </Button>
                    </div>
                    <div className="flex items-center sm:hidden">
                        <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open main menu</span>
                        </Button>
                    </div>
                </div>
            </div>
            {/* Mobile menu, show/hide based on menu state */}
            <div className="sm:hidden">
                <div className="pt-2 pb-3 space-y-1">
                    <Button
                        variant="ghost"
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                        onClick={handleSignOut} // Attach the sign-out logic for mobile menu
                    >
                        Sign out
                    </Button>
                </div>
            </div>
        </nav>
    );
}
