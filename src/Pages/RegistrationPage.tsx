import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router'; // Use TanStack for navigation
import styles from '../Styles/Registration.module.css'; // Import CSS module
import { RegistrationViewModel } from '../Models/RegistrationViewModel';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from '../Components/Auth';
import useGoogleLogin from '../Components/HandleGoogleLogin'; // Import the custom hook
import InputField from '../Components/InputField'; // Utilise le composant InputField
import SubmitButton from '../Components/SubmitButton'; // Utilise le composant SubmitButton

const RegistrationPage: React.FC = () => {
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // TanStack for navigation
    const { setIsauth, setUser, user } = useAuth();
    const { handleGoogleLogin } = useGoogleLogin(navigate); // Use the custom hook for Google login

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

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setIsauth(true);
                setTimeout(() => {
                    navigate({ to: '/home' });

                }, 0);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <legend className={styles.legend}>Register!</legend>

                <label htmlFor="username" className={styles.label}><b>Username:</b></label>
                <InputField
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Username"
                    required
                />

                <label htmlFor="email" className={styles.label}><b>Email:</b></label>
                <InputField
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                />

                <label htmlFor="password" className={styles.label}><b>Password:</b></label>
                <InputField
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />

                <label htmlFor="confirmPassword" className={styles.label}><b>Confirm Password:</b></label>
                <InputField
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                />
                {error && <p className={styles.error}>{error}</p>}

                <SubmitButton onClick={() => handleSubmit} label="Sign Up" />
            </form>

            <GoogleOAuthProvider clientId='593303417165-qptsgopn542rv2vosle4e43n9oagq12k.apps.googleusercontent.com'>
                <div className={styles.googlesignindiv}>
                    <p>Or</p>
                    <GoogleLogin onSuccess={handleGoogleLogin} />
                </div>
            </GoogleOAuthProvider>

            <div className={styles.logindiv}>
                <p>Already have an account?</p>
                <Link to="/login">LOGIN</Link>
            </div>
        </div>
    );
};

export default RegistrationPage;
