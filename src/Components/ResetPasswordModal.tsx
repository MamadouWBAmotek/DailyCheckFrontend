import React, { useState } from 'react';
import { ToDo } from '../Models/ToDo';
import styles from '../Styles/ResetPasswordModal.module.css';
import { Status } from '../Models/Status';
import { User } from './User';
import { Role } from '../Models/Roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faEnvelope, faEye, faLock, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserUpdateViewModel } from '../Models/UpdateUserViewModel';
import Logout from './Logout';
import InputField from './InputField';

interface ResetPasswordModalProps {
    isOpen: boolean;
    // succes: string | null;
    // setSucces: (succes: string) => void;
    email: string;
    setEmail: (email: string) => void;
    closeModal: () => void;
    handleResetPassword: (email: string) => Promise<void>;
    handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
    isOpen,
    // succes,
    // setSucces,
    email,
    setEmail,
    closeModal,
    handleResetPassword,
    handleOverlayClick
}) => {

    // const send = () => {
    //     handleResetPassword(email);
    //     setSucces("Email send!");
    //     setTimeout(() => {
    //         closeModal()
    //         setSucces('');
    //     }, 3000);
    // }
    const [succes, setSucces] = useState<string>('');
    const [error, setError] = useState<string>('');

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex pour un email valide
        return emailRegex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Empêche le rafraîchissement de la page

        if (isValidEmail(email)) {
            handleResetPassword(email);
            setError('');
            setSucces("We've send u a email if u're registered!");
            setTimeout(() => {
                closeModal()
                setSucces('');
            }, 2500);
            // Ici, vous pouvez envoyer l'email au backend ou effectuer une autre action
        } else {
            setError("Enter a valid emailaddress.");
            setSucces('');

        }
    };

    if (!isOpen) return null;

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    //     if (e.key === 'Enter') {
    //         e.preventDefault(); // Empêche le comportement par défaut du bouton "submit"
    //         if (isEditing) {
    //             if (isMainUser) {
    //                 handleMainUserSaveOnclick();
    //             } else {
    //                 handleUpdateUser(selectedUser);
    //             }
    //         } else {
    //             setIsEditing(true);
    //         }
    //     }
    // };



    return (
        <div className={styles.modal} onClick={handleOverlayClick}>
            <div className={styles['modal-content']}>
                <span className={styles.close} onClick={() => { closeModal(); }}>&times;</span>
                <form onSubmit={() => handleSubmit} >
                    <h1 style={{ color: 'green', fontSize: '24px', textAlign: 'center' }}>{succes}</h1>
                    <h1 style={{ color: 'red', fontSize: '24px', textAlign: 'center' }}>{error}</h1>
                    <legend>Forgot your password? No worries you can reset it easily.</legend>

                    <div style={{ display: "flex", position: 'relative', alignItems: 'center', width: '100%' }}>
                        <i style={{
                            position: 'absolute', top: '32px', left: '11px',
                            zIndex: '1',
                            fontSize: '16px',
                            color: '#888'

                        }}><FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon></i>

                        <input style={{ paddingLeft: '40px', width: '100%' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                            placeholder='Registered email address'
                            required
                        />
                    </div>



                    <input
                        onClick={handleSubmit}
                        type='submit' value={'send'} />
                </form >
            </div >
        </div >
    );
};

export default ResetPasswordModal;
