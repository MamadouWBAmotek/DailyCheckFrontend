import { jwtDecode } from "jwt-decode";
import { LoginWithGoogleViewModel } from "../Models/LoginWithGoogleViewModel";
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from "./Auth";
import { useState } from "react";
const { setIsauth } = useAuth();
const [error, setError] = useState<string | null>(null);
const navigate = useNavigate();


export const handleGoogleLogin = async (credentialResponse: any): Promise<void> => {
    if (credentialResponse.credential) {
        const googleOAuthResponse = jwtDecode<any>(credentialResponse.credential);

        const googleOautData: LoginWithGoogleViewModel = {
            Email: googleOAuthResponse.email,
            username: googleOAuthResponse.given_name,
            Id: googleOAuthResponse.sub,
        };

        try {
            const response = await fetch('http://localhost:5144/api/login/loginwithgoogle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(googleOautData),
            });

            if (response.ok) {
                setIsauth(true); // Mettez à jour l'état d'authentification
                setTimeout(() => {
                    navigate({ to: '/home' });
                }, 0);

            } else {
                const errorData = await response.json();
                setError(errorData.message || "Something went wrong");
            }
        } catch (error) {
            setError('Error checking email. Please try again later.');
        }
    } else {
        setError('No credential provided. Please try again.');
    }
};