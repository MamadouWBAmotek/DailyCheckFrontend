import { useState, createContext, useContext } from 'react';

// Créez un contexte d'authentification
const AuthContext = createContext<{ isauth: boolean; setIsauth: (value: boolean) => void } | undefined>(undefined);

// Provider pour le contexte
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isauth, setIsauth] = useState<boolean>(false);

    return (
        <AuthContext.Provider value={{ isauth, setIsauth }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
