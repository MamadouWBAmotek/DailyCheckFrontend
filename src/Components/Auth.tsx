import { useState, createContext, useContext } from 'react';
import { User } from './User';
import { GoogleUser } from './GoogleUser';

// Definition of the interface for the authentication context
interface AuthContextType {
    isauth: boolean; // Indicates if the user is authenticated
    setIsauth: (value: boolean) => void; // Function to update the authentication state
    user?: User | GoogleUser; // Can be a regular user (User) or a Google user (GoogleUser)
    setUser: (user: User | GoogleUser) => void; // Function to set the logged-in user
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider for the authentication context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isauth, setIsauth] = useState<boolean>(false); // State to track if the user is authenticated
    const [user, setUser] = useState<User | GoogleUser>(); // State to store the current user

    return (
        // Provides the state and the update functions to the rest of the app
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
