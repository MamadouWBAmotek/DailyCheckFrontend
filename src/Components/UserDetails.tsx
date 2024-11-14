import React, { useState } from 'react';
import { ToDo } from '../Models/ToDo';
import styles from '../Styles/ToDoDetailsModal.module.css';
import { Status } from '../Models/Status';
import { User } from './User';
import { Role } from '../Models/Roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserUpdateViewModel } from '../Models/UpdateUserViewModel';

interface UserDetailsModalProps {
    isOpen: boolean;
    error: string | null;
    setError: (error: string) => void;
    closeModal: () => void;
    selectedUser: User | null;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    isMainUser: boolean;
    setIsMainUser: (isMainUser: boolean) => void;
    handleUpdateUser: (user: User) => Promise<void>;
    handleUpdateMainUser: (user: UserUpdateViewModel) => Promise<void>;
    handleDeleteUser: (user: User) => Promise<void>;
    setSelectedUser: (user: User) => void;
    handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
    isOpen,
    closeModal,
    selectedUser,
    isEditing,
    isMainUser, setIsMainUser,
    error, setError,
    setIsEditing,
    handleUpdateUser,
    handleUpdateMainUser,
    handleDeleteUser,
    setSelectedUser,
    handleOverlayClick
}) => {
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isSaveClickable, setIsSaveClickable] = useState<boolean>(false);

    const mainuser: UserUpdateViewModel = {
        id: selectedUser?.id || -1,
        userName: selectedUser?.userName || '',
        email: selectedUser?.email || '',
        role: selectedUser?.role || Role.User,
        password: oldPassword || '',
        newPassword: confirmPassword || ''
    }
    const handleMainUserSaveOnclick = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!")
        }
        else if (oldPassword.length <= 0) {
            mainuser.password = '';
            mainuser.newPassword = '';
            setError('');
            handleUpdateMainUser(mainuser);
        }
        else if (newPassword?.length <= 10) {
            setError('Password must have 10 characters minimum')
        }
        else {
            handleUpdateMainUser(mainuser);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');
        }
    }

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
                    <h3>{isEditing ? 'Edit User' : 'User Details'}</h3>
                    <input
                        type="text"
                        value={selectedUser.userName}
                        onChange={(e) => setSelectedUser({ ...selectedUser, userName: e.target.value })}
                        disabled={!isEditing}
                    />
                    <input
                        type="text"
                        value={selectedUser.email}
                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                        disabled={!isEditing}
                        pattern={isEditing ? "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" : undefined}
                        required={isEditing} />

                    {(isMainUser && isEditing) ? <div><input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        disabled={!isEditing}
                        placeholder='Old password'
                        pattern={isEditing ? "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" : undefined}
                        required={isEditing} />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder='New password'
                            disabled={!isEditing}
                            pattern={isEditing ? "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" : undefined}
                            required />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Confirm new Password'
                            disabled={!isEditing}
                            pattern={isEditing ? "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" : undefined}
                            required />
                    </div> : ""}
                    {!isMainUser ? <select
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
                    </select> : ''}
                    <div style={{ display: "flex" }}>
                        {error && <p style={{ color: 'red', margin: '20px auto' }}>{error}</p>}
                    </div>
                    <div className={styles['button-container']}>
                        {isEditing ? (
                            <>
                                <button className={styles['cancel']} onClick={(e) => { e.preventDefault(); setIsEditing(false); }}>
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </button>
                                <button type='submit' disabled={isSaveClickable} className={styles['save']} onClick={(e) => { e.preventDefault(); isMainUser ? handleMainUserSaveOnclick(e) : handleUpdateUser(selectedUser) }}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button className={styles['delete']} onClick={(e) => { e.preventDefault(); handleDeleteUser(selectedUser); }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <button type='submit' className={styles['edit']} onClick={(e) => { e.preventDefault(); setIsEditing(true); }}>
                                    <FontAwesomeIcon icon={faPenToSquare} />
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
