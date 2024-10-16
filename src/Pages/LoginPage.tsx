import React, { useState } from 'react';
import { LoginViewModel } from '../Models/LoginViewModel';
import { LoginWithGoogleViewModel } from '../Models/LoginWithGoogleViewModel';
import { Link, useNavigate } from '@tanstack/react-router';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../Components/Auth'; 
import styles from '../Styles/Login.module.css'; // Importation du CSS Module

const LoginPage: React.FC = () => {
    const [userNameOrEmail, setUserNameOrEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setIsauth } = useAuth(); 

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const model: LoginViewModel = {
            UserNameOrEmail: userNameOrEmail,
            Password: password,
        };

        try {
            const response = await fetch('http://localhost:5000/api/login/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(model),
            });

            if (response.ok) {
                navigate({ to: '/home' });
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Unexpected error occurred.");
            }
        } catch (err) {
            setError('Network error. Please try again later.');
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
                const response = await fetch('http://localhost:5000/api/login/loginwithgoogle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(googleOautData),
                });

                if (response.ok) {
                    setIsauth(true);
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

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} id="form">
                <legend className={styles.legend}>Login!</legend>

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
                    {error && <span className={styles.textDanger}>{error}</span>}
                </div>

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
                    {error && <span className={styles.textDanger}>{error}</span>}
                </div>

                <a className={styles.resetPasswordHelper} href="/">Forgot password?</a>

                <div className={styles.loginButton}>
                    <input type="submit" value="Login" />
                </div>
            </form>

            <GoogleOAuthProvider clientId='593303417165-qptsgopn542rv2vosle4e43n9oagq12k.apps.googleusercontent.com'>
                <div className={styles.googlesignindiv}>
                    <p>Or</p>
                    <GoogleLogin onSuccess={handleGoogleLogin} />
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
