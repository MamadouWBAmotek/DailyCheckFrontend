import React from 'react';
import { ToDo } from '../Models/ToDo';
import styles from '../Styles/ToDoDetailsModal.module.css';
import { Status } from '../Models/Status';
import { User } from './User';
import { Role } from '../Models/Roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';



interface UserDetailsModalProps {
    isOpen: boolean;
    closeModal: () => void;
    selectedUser: User | null;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    handleUpdateUser: (user: User) => Promise<void>;
    handleDeleteUser: (user: User) => Promise<void>;
    setSelectedUser: (user: User) => void; // Ajoutez cette ligne
    handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
    isOpen,
    closeModal,
    selectedUser,
    isEditing,
    setIsEditing,
    handleUpdateUser,
    handleDeleteUser,
    setSelectedUser ,// Ajoutez cette ligne ici
    handleOverlayClick}) => {
    if (!isOpen || !selectedUser) return null;
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
                <form>
                    <h3>{isEditing ? 'Edit User' : 'User Details'}</h3>
                    <input
                        type="text"
                        value={selectedUser.userName}
                        onChange={(e) => setSelectedUser({ ...selectedUser, userName: e.target.value })} // Correction ici
                        disabled={!isEditing}
                    />
                    <input
                        type="text"
                        value={selectedUser.email}
                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} // Correction ici
                        disabled={!isEditing}
                    />
                    <select
                        name="status"
                        id="status"
                        // Assurez-vous que "role" est bien la propriété de l'objet `selectedUser`
                        onChange={(e) => setSelectedUser({ ...selectedUser, role: parseInt(e.target.value) as Role })}
                        disabled={!isEditing}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <div className={styles['button-container']}>
                        {isEditing ? (
                            <>
                                <button className={styles['cancel']} onClick={(e) => { e.preventDefault(); setIsEditing(false) }}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></button>
                                <button className={styles['save']} onClick={() => { handleUpdateUser(selectedUser) }}><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon></button>
                            </>
                        ) : (
                            <>
                                <button className={styles['delete']} onClick={() => { handleDeleteUser(selectedUser) }}><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></button>
                                <button className={styles['edit']} onClick={(e) => { e.preventDefault(); setIsEditing(true) }}><FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon></button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserDetailsModal;
