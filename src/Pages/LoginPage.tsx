import React, { useEffect, useState } from 'react';
import { LoginViewModel } from '../Models/LoginViewModel';
import { LoginWithGoogleViewModel } from '../Models/LoginWithGoogleViewModel';
import { Link, useNavigate } from '@tanstack/react-router';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../Components/Auth';
import Cookies from 'js-cookie'; // Import js-cookie
import styles from '../Styles/Login.module.css';

const LoginPage: React.FC = () => {
    // Import necessary hooks and components
    const [userNameOrEmail, setUserNameOrEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null); // State to manage error messages

    const navigate = useNavigate(); // Hook to navigate between pages
    const { setIsauth, setUser } = useAuth(); // Custom hook to manage authentication

    // Effect to log the user object when it changes
    useEffect(() => {
        console.log('User state changed');
    }, []);

    // Function to validate password (at least 10 characters)
    const validatePassword = (password: string): boolean => {
        return password.length > 9;
    };
    const handleErrorResponse = (response: Response, data: any) => {
        if (response.status === 400) {
            // Check for specific error messages
            if (data.message === "User was not found") {
                setError("User was not found."); // Error: User not found
            } else if (data.message === "Password is incorrect") {
                setError("Password is incorrect."); // Error: Incorrect password
            } else {
                setError(data.message || "Invalid login credentials."); // Other login errors
            }
        } else {
            setError("Unexpected error occurred."); // General unexpected error
        }
    };

    // Handle form submission for login
    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault(); // Prevents the page from reloading

        // Validate the password length before sending the request
        if (!validatePassword(password)) {
            setError("Password must be at least 10 characters long.");
            return; // Stops submission if password is invalid
        }

        // Data model for the login request
        const model: LoginViewModel = {
            UserNameOrEmail: userNameOrEmail,
            Password: password,
        };

        try {
            // POST request to authenticate user
            const response = await fetch('http://localhost:5144/api/login/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(model), // Sends the model as JSON
            });
            const data = await response.json(); // Retrieves response as JSON

            if (response.ok) {
                // If login is successful, update the user and authentication state
                setUser(data.user); // Set the user state
                setIsauth(true); // Set authenticated state
                Cookies.set('user', JSON.stringify(data.user)); // Store user info in cookie
                setTimeout(() => {
                    navigate({ to: '/home' }); // Redirects to the home page

                }, 0);
            } else {
                // Handle error responses
                handleErrorResponse(response, data);
            }
        } catch (err) {
            // Handle network errors
            setError('Network error. Please try again later.');
        }
    };

    // Function to handle error responses


    // Handle Google OAuth login
    const handleGoogleLogin = async (credentialResponse: any): Promise<void> => {
        if (credentialResponse.credential) {
            // Decode the JWT token received from Google
            const googleOAuthResponse = jwtDecode<any>(credentialResponse.credential);

            // Data model for Google login request
            const googleOautData: LoginWithGoogleViewModel = {
                Email: googleOAuthResponse.email,
                username: googleOAuthResponse.given_name,
                Id: googleOAuthResponse.sub,
            };

            try {
                // POST request to authenticate using Google OAuth
                const response = await fetch('http://localhost:5144/api/login/loginwithgoogle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(googleOautData), // Sends the model as JSON
                });
                const data = await response.json(); // Retrieves response as JSON

                if (response.ok) {
                    // If Google login is successful, update user and authentication state
                    setUser(data.user);
                    setIsauth(true);
                    Cookies.set('user', JSON.stringify(data.user)); // Store user info in cookie
                    setTimeout(() => {
                        navigate({ to: '/home' }); // Redirects to the home page

                    }, 0);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || "Something went wrong"); // Handle Google OAuth errors
                }
            } catch (error) {
                // Handle network errors
                setError('Error checking email. Please try again later.');
            }
        } else {
            // Error if no credential is provided by Google
            setError('No credential provided. Please try again.');
        }
    };

    // Render the login form and Google OAuth integration
    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} id="form">
                <legend className={styles.legend}>Login!</legend>

                {/* Input field for username or email */}
                <label htmlFor="username" className={styles.label}><b>Username Or Email:</b></label>
                <div className={styles.iconInput}>
                    <input
                        type="text"
                        value={userNameOrEmail}
                        onChange={(e) => setUserNameOrEmail(e.target.value)}
                        className={styles.username}
                        placeholder="Username or email"
                        required
                        autoFocus
                    />
                    {error && <span className={styles.textDanger}>{error}</span>} {/* Display error if present */}
                </div>

                {/* Input field for password */}
                <label htmlFor="password" className={styles.label}><b>Password:</b></label>
                <div className={styles.iconInput}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="inputField"
                        placeholder="Password"
                        required
                    />
                    {error && <span className={styles.textDanger}>{error}</span>} {/* Display error if present */}
                </div>

                {/* Link for password reset */}
                <a className={styles.resetPasswordHelper} href="/">Forgot password?</a>

                {/* Submit button */}
                <div className={styles.loginButton}>
                    <input type="submit" value="Login" />
                </div>
            </form>

            {/* Google OAuth integration for login */}
            <GoogleOAuthProvider clientId='593303417165-qptsgopn542rv2vosle4e43n9oagq12k.apps.googleusercontent.com'>
                <div className={styles.googlesignindiv}>
                    <p>Or</p>
                    <GoogleLogin onSuccess={handleGoogleLogin} />
                </div>
            </GoogleOAuthProvider>

            {/* Link to registration page */}
            <div className={styles.signupdiv}>
                <p>You don't have an account yet?</p>
                <Link to="/registration">SIGN UP</Link>
            </div>
        </div>
    );
};

export default LoginPage;
