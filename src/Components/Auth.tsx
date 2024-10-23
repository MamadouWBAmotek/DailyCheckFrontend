import React, { useState, createContext, useContext, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie
import { User } from './User';
import { GoogleUser } from './GoogleUser';

// Definition of the interface for the authentication context
interface AuthContextType {
    isauth: boolean; // Indicates if the user is authenticated
    setIsauth: (value: boolean) => void; // Function to update the authentication state
    user?: User; //
    setUser: (user: User|undefined) => void; // Function to set the logged-in user
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider for the authentication context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isauth, setIsauth] = useState<boolean>(() => {
        // Initialize state from cookie if it exists
        return !!Cookies.get('isauth');
    });
    const [user, setUser] = useState<User|undefined>(() => {
        // Retrieve user information from cookie if it exists
        const userCookie = Cookies.get('user');
        return userCookie ? JSON.parse(userCookie) : undefined;
    });

    // Effect to handle side effects of authentication state changes
    useEffect(() => {
        // Set or remove cookies based on authentication state
        if (isauth) {
            Cookies.set('isauth', 'true'); // Set the cookie when authenticated
            Cookies.set('user', JSON.stringify(user)); // Store user info in a cookie
        } else {
            Cookies.remove('isauth'); // Remove cookie when logged out
            Cookies.remove('user'); // Remove user info cookie
        }
    }, [isauth, user]);

    return (
        <AuthContext.Provider value={{ isauth, setIsauth, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the authentication context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
