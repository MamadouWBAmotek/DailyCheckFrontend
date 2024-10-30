import React, { useEffect, useState } from 'react';
import { LoginViewModel } from '../Models/LoginViewModel';
import { Link, useNavigate } from '@tanstack/react-router';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from '../Components/Auth';
import Cookies from 'js-cookie'; // Import js-cookie
import styles from '../Styles/Login.module.css';
import useGoogleLogin from '../Components/HandleGoogleLogin'
import InputField from '../Components/InputField';
import SubmitButton from '../Components/SubmitButton';
import { handleErrorResponse } from '../Utils/HandleErrorResponse';

const LoginPage: React.FC = () => {
    const [userNameOrEmail, setUserNameOrEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Hook to navigate between pages
    const { setIsauth, setUser, user } = useAuth(); // Custom hook to manage authentication
    const { handleGoogleLogin } = useGoogleLogin(navigate); // Utilisez le hook pour gérer la connexion Google

    // ... (autres méthodes et effets)


    // Handle form submission for login
    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const model: LoginViewModel = {
            UserNameOrEmail: userNameOrEmail,
            Password: password,
        };

        try {
            const response = await fetch('http://localhost:5144/api/login/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(model),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.user != null) {
                    setUser(data.user);
                    console.log(user)
                    setIsauth(true);
                    Cookies.set('user', JSON.stringify(data.user));
                    Cookies.set('isauth', 'true');
                    setTimeout(() => {
                        navigate({ to: '/home' });

                    }, 0);
                }
                else {
                    setUser(data.GoogleUser)
                    console.log(user)
                    setIsauth(true);
                    Cookies.set('user', JSON.stringify(data.googleUser));
                    Cookies.set('isauth', 'true');
                    setTimeout(() => {
                        navigate({ to: '/home' });

                    }, 0);
                }


            } else {
                setError(data.message);
                handleErrorResponse(response, data);
            }
        } catch (err) {
            setError('Network error. Please try again later.');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} id="form">
                <legend className={styles.legend}>Login!</legend>

                <label htmlFor="username" className={styles.label}><b>Username Or Email:</b></label>
                <InputField
                    type="text"
                    value={userNameOrEmail}
                    onChange={(e) => setUserNameOrEmail(e.target.value)}
                    placeholder="Username or email"
                    required
                />

                <label htmlFor="password" className={styles.label}><b>Password:</b></label>
                <InputField
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />

                <a className={styles.resetPasswordHelper} href="/">Forgot password?</a>
                <p className={styles.error}>{error}</p>

                <SubmitButton onClick={() => { handleSubmit }} label="Login" />
            </form>

            <GoogleOAuthProvider clientId='593303417165-qptsgopn542rv2vosle4e43n9oagq12k.apps.googleusercontent.com'>
                <div className={styles.googlesignindiv}>
                    <p>Or</p>
                    <div><GoogleLogin onSuccess={handleGoogleLogin} /></div>
                </div>
            </GoogleOAuthProvider>

            <div className={styles.signupdiv}>
                <p>You don't have an account yet?</p>
                <Link to="/registration">SIGN UP</Link>
            </div>
        </div>
    );
};

export default LoginPage;
