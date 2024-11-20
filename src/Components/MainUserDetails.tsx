import React, { useState } from 'react';
import { ToDo } from '../Models/ToDo';
import styles from '../Styles/MainUserDetailsModal.module.css';
import { Status } from '../Models/Status';
import { User } from './User';
import { Role } from '../Models/Roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faEye, faLock, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserUpdateViewModel } from '../Models/UpdateUserViewModel';
import Logout from './Logout';

interface MainUserDetailsModalProps {
    isOpen: boolean;
    error: string | null;
    setError: (error: string) => void;
    closeModal: () => void;
    selectedUser: User | null;
    isEditing: boolean;
    isPasswordEditing: boolean;
    setIsPasswordEditing: (isPasswordEditing: boolean) => void;
    setIsEditing: (isEditing: boolean) => void;
    isMainUser: boolean;
    setIsMainUser: (isMainUser: boolean) => void;
    handleUpdateUser: (user: User) => Promise<void>;
    handleUpdateMainUser: (user: UserUpdateViewModel) => Promise<void>;
    handleDeleteUser: (user: User) => Promise<void>;
    setSelectedUser: (user: User) => void;
    handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const MainUserDetailsModal: React.FC<MainUserDetailsModalProps> = ({
    isOpen,
    closeModal,
    selectedUser,
    isEditing,
    isPasswordEditing,
    setIsPasswordEditing,
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

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleOldPasswordVisibility = () => {
        setShowOldPassword(!showOldPassword);
    };
    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const mainuser: UserUpdateViewModel = {
        id: selectedUser?.id || -1,
        userName: selectedUser?.userName || '',
        email: selectedUser?.email || '',
        role: selectedUser?.role || Role.User,
        password: oldPassword || '',
        newPassword: confirmPassword || ''
    }
    const handleMainUserSaveOnclick = () => {

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!")
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowOldPassword(false)
            setShowNewPassword(false)
            setShowConfirmPassword(false)


        }
        else if (oldPassword.length <= 0 && (newPassword.length <= 0 && confirmPassword.length <= 0)) {
            mainuser.password = '';
            mainuser.newPassword = '';

            handleUpdateMainUser(mainuser);
            setError('')
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowOldPassword(false)
            setShowNewPassword(false)
            setShowConfirmPassword(false)
        }
        else if (newPassword?.length < 10 || oldPassword?.length < 10 || confirmPassword?.length < 10) {
            setError('Password must have 10 characters minimum');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowOldPassword(false)
            setShowNewPassword(false)
            setShowConfirmPassword(false)
        }
        else {
            handleUpdateMainUser(mainuser);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');
            setShowOldPassword(false)
            setShowNewPassword(false)
            setShowConfirmPassword(false)
        }
    }

    if (!isOpen || !selectedUser) return null;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Empêche le comportement par défaut du bouton "submit"
            if (isEditing) {
                if (isMainUser) {
                    handleMainUserSaveOnclick();
                } else {
                    handleUpdateUser(selectedUser);
                }
            } else {
                setIsEditing(true);
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
                <span className={styles.close} onClick={() => { closeModal(); setOldPassword(''); setNewPassword(''); setConfirmPassword(''); }}>&times;</span>
                <form onKeyDown={handleKeyDown} onSubmit={(e) => {
                    e.preventDefault();
                    if (isEditing) {
                        if (isMainUser) {
                            handleMainUserSaveOnclick();
                        } else {
                            handleUpdateUser(selectedUser);
                        }
                    } else {
                        setIsEditing(true);
                    }
                }}>
                    <h1 style={{ textAlign: 'center' }}>
                        {isEditing ?
                            isPasswordEditing ? 'Edit Password' : 'Edit User'
                            : 'User Details'}
                    </h1>
                    {!isPasswordEditing ?

                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <label htmlFor="Username">Username</label>
                            <input style={{ width: "100%" }}
                                type="text"
                                value={selectedUser.userName}
                                onChange={(e) => setSelectedUser({ ...selectedUser, userName: e.target.value })}
                                disabled={!isEditing} />

                            <label htmlFor="Email">Email</label>
                            <input style={{ width: "100%" }}
                                type="email"
                                value={selectedUser.email}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                disabled={!isEditing}
                                pattern={"[a-z0-100%9._+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"}
                                required={isEditing} />
                        </div>

                        : ""}

                    {(isMainUser && isEditing && isPasswordEditing) ?
                        <div>

                            <i style={{
                                position: 'absolute', top: '107px', left: '26px',
                                zIndex: '1',
                                fontSize: '16px',
                                // cursor:'pointer'

                            }}><FontAwesomeIcon icon={faLock}></FontAwesomeIcon></i>
                            <input
                                style={{ width: '100%', paddingLeft: "30px" }}
                                type={showOldPassword ? 'text' : 'password'}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                disabled={!isEditing}
                                placeholder='Old password'
                            />
                            <i style={{
                                position: 'absolute', top: '107px', right: '40px',
                                zIndex: '2',
                                fontSize: '16px',

                            }} onClick={() => toggleOldPasswordVisibility()} >
                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                            </i>


                            <i style={{
                                position: 'absolute', top: '173px', left: '26px',
                                zIndex: '1',
                                fontSize: '16px',
                                // cursor:'pointer'

                            }}><FontAwesomeIcon icon={faLock}></FontAwesomeIcon></i>

                            <input
                                style={{ width: '100%', paddingLeft: "30px" }}

                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder='New password'
                                disabled={!isEditing}
                            />
                            <i style={{
                                position: 'absolute', top: '173px', right: '40px',
                                zIndex: '2',
                                fontSize: '16px',

                            }} onClick={() => toggleNewPasswordVisibility()} >
                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                            </i>

                            <i style={{
                                position: 'absolute', top: '238px', left: '26px',
                                zIndex: '1',
                                fontSize: '16px',
                                // cursor:'pointer'

                            }}><FontAwesomeIcon icon={faLock}></FontAwesomeIcon></i>
                            <input
                                style={{ width: '100%', paddingLeft: "30px" }}
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Confirm new Password'
                                disabled={!isEditing}
                            />
                            <i style={{
                                position: 'absolute', top: '238px', right: '40px',
                                zIndex: '2',
                                fontSize: '16px',

                            }} onClick={() => toggleConfirmPasswordVisibility()} >
                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                            </i>

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
                    {error && <p style={{ color: 'red', margin: '5px auto', backgroundColor: "", textAlign: 'center' }}>{error}</p>}
                    <div className={styles['button-container']}>
                        {isEditing ? (
                            <>
                                <button className={styles['cancel']} onClick={(e) => { setIsPasswordEditing(false); e.preventDefault(); setIsEditing(false); closeModal(); setError('') }}>
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </button>
                                {!isPasswordEditing && isMainUser ? <button style={{ padding: '0' }} type='button' onClick={(e) => { e.preventDefault(); setIsPasswordEditing(true) }}>Change Password</button> : ""}

                                <button type='submit' className={styles['save']}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>
                            </>
                        ) : (
                            <>
                                {!isMainUser ? <button className={styles['delete']} onClick={(e) => { e.preventDefault(); handleDeleteUser(selectedUser); }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button> : ""}
                                {isMainUser ? <Logout></Logout> : ""
                                }
                                <button type='button' className={styles['edit']} onClick={(e) => { e.preventDefault(); setIsEditing(true); }}>
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

export default MainUserDetailsModal;
