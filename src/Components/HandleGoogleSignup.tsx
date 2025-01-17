import { useAuth } from '../Components/Auth'; // Importez le hook d'authentification
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { error } from 'console';

const useGoogleSignup = (navigate: any) => {
    const { setIsauth, setUser, user } = useAuth(); // Utilisez le hook d'authentification
    const [isLoading, setIsLoading] = useState<boolean>(false); // Adding a loading indicator
    const [error, setError] = useState<string | null>(null); // Error state

    const handleGoogleSignup = async (credentialResponse: any): Promise<void> => {
        if (credentialResponse.credential) {
            // Décodez le JWT reçu de Google
            const googleOAuthResponse = jwtDecode<any>(credentialResponse.credential);

            // Modèle de données pour la connexion Google
            const googleOautData = {
                Email: googleOAuthResponse.email,
                username: googleOAuthResponse.given_name,
                Id: googleOAuthResponse.sub,
            };

            try {
                setIsLoading(true);
                // POST request to authenticate using Google OAuth
                const response = await fetch('http://localhost:5144/api/login/signupwithgoogle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(googleOautData),
                });
                const data = await response.json();
                console.log("this is the data", data)
                if (response.ok) {
                    // if (data.user != null) {
                    //     setUser(data.user);
                    //     Cookies.set('user', JSON.stringify(data.user));
                    //     Cookies.set('isauth', 'true');
                    //     setIsauth(true);
                    //     setTimeout(() => {
                    //         navigate({ to: '/home' });

                    //     }, 0);
                    // }
                    if (data.googleUser != null) {
                        setUser(data.googleUser)
                        Cookies.set('user', JSON.stringify(data.googleUser));
                        Cookies.set('isauth', 'true');
                        setIsauth(true);
                        setTimeout(() => {
                            navigate({ to: '/home' });

                        }, 0);
                    }
                } else {

                    setError(data.message)
                    
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Something went wrong");
                }
            } catch (error) {
                console.error('Error during Google login:', error);
                throw new Error('Error checking email. Please try again later.');
            }
            finally {
                setIsLoading(false);
            }
        } else {
            throw new Error('No credential provided. Please try again.');
        }
    };

    return { handleGoogleSignup, isLoading, error };
};

export default useGoogleSignup;
