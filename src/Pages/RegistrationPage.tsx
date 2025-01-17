import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router'; // Use TanStack for navigation
import styles from '../Styles/Registration.module.css'; // Import CSS module
import { RegistrationViewModel } from '../Models/RegistrationViewModel';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from '../Components/Auth';
import InputField from '../Components/InputField'; 
import SubmitButton from '../Components/SubmitButton'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import useGoogleSignup from '../Components/HandleGoogleSignup';

const RegistrationPage: React.FC = () => {
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // TanStack for navigation
    const { setIsauth, setUser, user } = useAuth();
    const { handleGoogleSignup, isLoading: googleSignupLoading, error: googleSignupError } = useGoogleSignup(navigate);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Adding a loading indicator

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
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
            setIsLoading(true);
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
        finally {
            setIsLoading(false);
        }
    };




    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ height: '600px', width: '50%', marginTop: '50px', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <h1 style={{ fontSize: '70px', }}>
                    Every day counts. Make it the best with DailyCheck</h1>
            </div>
            <div className={styles.container}>
                <form onSubmit={handleSubmit}>
                    <legend className={styles.legend}>Register!</legend>
                    <div style={{  height: '100px' }}>
                        <i style={{
                            position: 'relative', top: '60px',
                            zIndex: '1',
                            fontSize: '16px',
                            marginLeft: '10px'

                        }}>
                            <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                        </i>
                        <span> <InputField
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Username"
                            required
                        /></span>
                    </div>

                    <div style={{  height: '100px' }}>
                        <i style={{
                            position: 'relative', top: '65px', right: '',
                            zIndex: '1',
                            fontSize: '16px',
                            marginLeft: '10px'

                        }}>
                            <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
                        </i>
                        <InputField
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        />
                    </div>


                    <div style={{height:'100px',marginTop:'20px', display: "flex", position: 'relative', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ marginRight: '20px' }}>
                            <i style={{
                                position: 'relative', top: '60px', left: '10px',
                                zIndex: '1',
                                fontSize: '16px',
                            }}>
                                <FontAwesomeIcon icon={faLock}></FontAwesomeIcon></i>
                            <InputField type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required

                            /> <i style={{
                                position: 'relative', bottom: '55px', left: '220px',
                                zIndex: '2',
                                fontSize: '16px',
                                cursor: 'pointer'

                            }} onClick={() => togglePasswordVisibility()} >
                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                            </i>
                        </div>
                        <div>
                            <i style={{
                                position: 'relative', top: '60px', left: '10px',
                                zIndex: '1',
                                fontSize: '16px',

                            }}><FontAwesomeIcon icon={faLock}></FontAwesomeIcon></i>
                            <InputField type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                required />
                            <i style={{
                                position: 'relative', bottom: '55px', left: '220px',
                                zIndex: '2',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }} onClick={() => toggleConfirmPasswordVisibility()} >
                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                            </i>
                        </div>

                    </div>

                    {(isLoading || googleSignupLoading) && <p style={{ textAlign: 'center' }}>Loading...</p>}
                    {(error || googleSignupError) && <p className={styles.error}>{error}  {googleSignupError}</p>}

                    <SubmitButton onClick={() => handleSubmit} label="Sign Up" />
                </form>

                <GoogleOAuthProvider clientId='593303417165-qptsgopn542rv2vosle4e43n9oagq12k.apps.googleusercontent.com'>
                    <div className={styles.googlesignindiv}>
                        <p>Or sign-up with Google</p>

                        <div><GoogleLogin onSuccess={handleGoogleSignup} /></div>
                        <div className=''>
                        </div>
                    </div>
                </GoogleOAuthProvider>

                <div className={styles.logindiv}>
                    <p>Already have an account?</p>
                    <Link to="/login">LOGIN</Link>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;
