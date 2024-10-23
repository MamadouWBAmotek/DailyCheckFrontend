import React from 'react';
import { useAuth } from '../Components/Auth';
import Cookies from 'js-cookie';
import { useNavigate } from '@tanstack/react-router';

const Logout: React.FC = () => {
    const { setIsauth, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsauth(false); // Update authentication state
        setUser(undefined); // Clear user state
        Cookies.remove('isauth'); // Remove authentication cookie
        Cookies.remove('user'); // Remove user cookie
        navigate({ to: '/login' }); // Redirect to the home page or login page
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
