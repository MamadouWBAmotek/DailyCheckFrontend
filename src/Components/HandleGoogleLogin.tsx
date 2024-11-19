// useGoogleLogin.ts
import { useAuth } from '../Components/Auth'; // Importez le hook d'authentification
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useState } from 'react';

const useGoogleLogin = (navigate: any) => {
    const { setIsauth, setUser, user } = useAuth(); // Utilisez le hook d'authentification
    const [isLoading, setIsLoading] = useState<boolean>(false); // Adding a loading indicator

    const handleGoogleLogin = async (credentialResponse: any): Promise<void> => {
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
                const response = await fetch('http://localhost:5144/api/login/loginwithgoogle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(googleOautData),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.user != null) {
                        setUser(data.user);
                        console.log("it is a user" + typeof (data), user)
                        setIsauth(true);
                        Cookies.set('user', JSON.stringify(data.user));
                        Cookies.set('isauth', 'true');
                        setTimeout(() => {
                            navigate({ to: '/home' });

                        }, 0);
                    }
                    else {
                        setUser(data.googleUser)
                        console.log("it is a googleuser" + typeof (data), data.googleUser)
                        setIsauth(true);
                        Cookies.set('user', JSON.stringify(data.googleUser));
                        Cookies.set('isauth', 'true');
                        setTimeout(() => {
                            navigate({ to: '/home' });

                        }, 0);
                    }
                } else {
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

    return { handleGoogleLogin };
};

export default useGoogleLogin;
