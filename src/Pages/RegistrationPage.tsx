import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router'; // Use TanStack for navigation
import '../Styles/Registration.css';
import { RegistrationViewModel } from '../Models/RegistrationViewModel';
import { LoginWithGoogleViewModel } from '../Models/LoginWithGoogleViewModel';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const RegistrationPage: React.FC = () => {
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // TanStack for navigation

    // Handle form submission with async arrow function
    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const model: RegistrationViewModel = {
            UserName: userName,
            Email: email,
            Password: password,
            ConfirmPassword: confirmPassword,
        };

        try {
            const response = await fetch('http://localhost:5144/api/login/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(model),
            });

            if (response.ok) {
                // Navigate to login page upon successful registration
                navigate({ to: '/login' });
            }
            else if (response.status == 400 || response.statusText == "Login! u already have an account") {
                const result = await response.json();
                setError(result.message || response.statusText);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again later.');
        }
    };
    const handleGoogleLogin = async (credentialResponse: any): Promise<void> => {
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

                if (!response.ok) {
                    throw new Error('Something went wrong');
                }

                // Redirect with TanStack, regardless of whether the user exists or not
                navigate({ to: '/home' });
            } catch (error) {
                setError('Error checking email. Please try again later.');
                console.error('Error checking email:', error);
            }
        } else {
            setError('No credential provided. Please try again.');
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <legend>Register!</legend>

                <label htmlFor="username"><b>Username:</b></label>
                <div className="iconInput">
                    <i className="fa-solid fa-user fa-xl"></i>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Username"
                        required
                        autoFocus
                    />
                </div>

                <label htmlFor="email"><b>Email:</b></label>
                <div className="iconInput">
                    <i className="fa-solid fa-envelope fa-xl"></i>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </div>

                <label htmlFor="password"><b>Password:</b></label>
                <div className="iconInput">
                    <i className="fa-solid fa-lock fa-xl"></i>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                </div>

                <label htmlFor="confirmPassword"><b>Confirm Password:</b></label>
                <div className="iconInput">
                    <i className="fa-solid fa-lock fa-xl"></i>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                    />
                </div>

                <div className="registerButton">
                    <button type="submit">Sign Up</button>
                </div>

                {error && <p className="error">{error}</p>}
            </form>

            <GoogleOAuthProvider clientId='593303417165-qptsgopn542rv2vosle4e43n9oagq12k.apps.googleusercontent.com'>
                <div className="googlesignindiv">
                    <p>Or</p>

                    <GoogleLogin onSuccess={handleGoogleLogin} />
                </div>
            </GoogleOAuthProvider>

            <div className="logindiv">
                <p>Already have an account?</p>
                <Link to="/login">LOGIN</Link>
            </div>
        </div>
    );
};

export default RegistrationPage;
