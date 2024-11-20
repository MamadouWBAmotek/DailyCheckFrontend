import React, { useState, createContext, useContext, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie
import { User } from './User';
import { GoogleUser } from './GoogleUser';

// Definition of the interface for the authentication context
interface AuthContextType {
    isauth: boolean; // Indicates if the user is authenticated
    setIsauth: (value: boolean) => void; // Function to update the authentication state
    user?: User|undefined; // User object
    setUser: (user: User|undefined) => void; // Function to set the logged-in user
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider for the authentication context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isauth, setIsauth] = useState<boolean>(() => {
        return Cookies.get('isauth') === 'true'; // Check if the cookie is "true"
    });

    const [user, setUser] = useState<User|undefined>(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            try {
                return JSON.parse(userCookie); // Try to parse the user cookie
            } catch (error) {
                console.error('Failed to parse user cookie:', error);
                return undefined; // Return undefined if parsing fails
            }
        }
        return undefined; // Return undefined if cookie doesn't exist
    });

    // Effect to handle side effects of authentication state changes
    useEffect(() => {
        if (isauth) {
            Cookies.set('isauth', 'true');
            if (user) {
                Cookies.set('user', JSON.stringify(user)); // Check that user is not undefined
            }
        } else {
            Cookies.remove('isauth');
            Cookies.remove('user');
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
