import React, { useEffect, useRef } from 'react';
import styles from '../Styles/UserDetailsModal.module.css';
import { User } from './User';
import { Role } from '../Models/Roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

interface UserDetailsModalProps {
    isOpen: boolean;
    error: string | null;
    setError: (error: string) => void;
    closeModal: () => void;
    selectedUser: User | null;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    handleUpdateUser: (user: User) => Promise<void>;
    handleDeleteUser: (user: User) => Promise<void>;
    setSelectedUser: (user: User) => void;
    handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
    isOpen,
    closeModal,
    selectedUser,
    isEditing,
    error, setError,
    setIsEditing,
    handleUpdateUser,
    handleDeleteUser,
    setSelectedUser,
    handleOverlayClick
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus(); // Donne le focus au champ
        }
    }, [isEditing]);
    if (!isOpen || !selectedUser) return null;


    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Empêche le comportement par défaut du bouton "submit"
            if (isEditing) {
                handleUpdateUser(selectedUser);
            }
        }
    };

    const options = selectedUser.role === Role.Admin
        ? [
            { value: Role.Admin, label: Role[Role.Admin] },
            { value: Role.User, label: Role[Role.User] }
        ]
        : [
            { value: Role.User, label: Role[Role.User] },
            { value: Role.Admin, label: Role[Role.Admin] }
        ];

    return (
        <div className={styles.modal} onClick={handleOverlayClick}>
            <div className={styles['modal-content']}>
                <span className={styles.close} onClick={closeModal}>&times;</span>
                <form onKeyDown={handleKeyDown} onSubmit={() => isEditing ? handleUpdateUser : setIsEditing(true)}>
                    <h1 style={{ textAlign: "center" }}>{isEditing ? 'Edit User' : 'User Details'}</h1>
                    <label htmlFor="username">Username</label>
                    <input
                        ref={inputRef}
                        type="text"
                        value={selectedUser.userName}
                        onChange={(e) => setSelectedUser({ ...selectedUser, userName: e.target.value })}
                        disabled={!isEditing}
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        value={selectedUser.email}
                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                        disabled={!isEditing}
                        pattern={isEditing ? "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" : undefined}
                        required={isEditing}
                    />

                    <label htmlFor="Status">Status</label>
                    <select
                        name="status"
                        id="status"
                        onChange={(e) => setSelectedUser({ ...selectedUser, role: parseInt(e.target.value) as Role })}
                        disabled={!isEditing}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div style={{ display: "flex" }}>
                        {error && <p style={{ color: 'red', margin: '20px auto' }}>{error}</p>}
                    </div>
                    <div className={styles['button-container']}>
                        {isEditing && (
                            <>
                                <button className={styles['cancel']} onClick={(e) => { e.preventDefault(); setIsEditing(false); }}>
                                    <FontAwesomeIcon icon={faArrowLeft} color='orange'/>
                                </button>
                                <button type='submit' className={styles['save']} onClick={(e) => { e.preventDefault(); handleUpdateUser(selectedUser); }}>
                                    <FontAwesomeIcon icon={faCheck} color='green'/>
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserDetailsModal;
