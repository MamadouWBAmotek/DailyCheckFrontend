import React, { useEffect, useState } from 'react';
import { LoginViewModel } from '../Models/LoginViewModel';
import { Link, useNavigate } from '@tanstack/react-router';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from '../Components/Auth';
import Cookies from 'js-cookie';
import styles from '../Styles/Login.module.css';
import useGoogleLogin from '../Components/HandleGoogleLogin'
import InputField from '../Components/InputField';
import SubmitButton from '../Components/SubmitButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

const LoginPage: React.FC = () => {
    const [userNameOrEmail, setUserNameOrEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Hook to navigate between pages
    const { setIsauth, setUser, user } = useAuth(); // Custom hook to manage authentication
    const { handleGoogleLogin, error: googleLoginError, isLoading: googleLoginloading } = useGoogleLogin(navigate); // Utilisez le hook pour gérer la connexion Google
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Adding a loading indicator

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const model: LoginViewModel = {
            UserNameOrEmail: userNameOrEmail,
            Password: password,
        };

        try {
            setIsLoading(true)
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
            }
        } catch (err) {
            setError('Network error. Please try again later.');
        }
        finally {
            setIsLoading(false)
        }

    };


    return (
        <div className={styles.bodycontainer}>
            <div className={styles.tekst}>
                <h1 style={{ fontSize: '70px', }}>
                    Log in and take back control of your days</h1>
            </div>
            <div className={styles.container}>
                <form onSubmit={handleSubmit} id="form">
                    <legend className={styles.legend}>Login</legend>


                    <div style={{ display: "flex", position: 'relative', alignItems: 'center', width: '100%' }}>
                        <i style={{
                            position: 'absolute', top: '35px', left: '11px',
                            zIndex: '1',
                            fontSize: '16px',


                        }}><FontAwesomeIcon icon={faUser}></FontAwesomeIcon></i>

                        <InputField
                            type="text"
                            value={userNameOrEmail}
                            onChange={(e) => setUserNameOrEmail(e.target.value)}
                            placeholder="Username or email"
                            required
                        />
                    </div>

                    <div style={{ display: "flex", position: 'relative', alignItems: 'center', width: '100%' }}>
                        <i style={{
                            position: 'absolute', top: '35px', left: '10px',
                            zIndex: '1',
                            fontSize: '16px',

                        }}><FontAwesomeIcon icon={faLock}></FontAwesomeIcon></i>
                        <InputField type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required

                        />
                        <i style={{
                            position: 'absolute', top: '35px', right: '10px',
                            zIndex: '2',
                            fontSize: '16px',
                            cursor: 'pointer'

                        }} onClick={() => togglePasswordVisibility()} >
                            <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                        </i>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <a className={styles.resetPasswordHelper} >Forgot password?</a>
                    </div>
                    {(isLoading || googleLoginloading) && <p style={{ textAlign: 'center' }}>Loading...</p>}
                    {(error || googleLoginError) && <p className={styles.error}>{error}  {googleLoginError}</p>}

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
                    <Link to="/register">SIGN UP</Link>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
