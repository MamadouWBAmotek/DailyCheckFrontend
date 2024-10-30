import React from 'react';
import Logout from '../Components/Logout';
import styles from '../Styles/Home.module.css';

interface UserModalProps {
    isOpen: boolean;
    closeModal: () => void;
    userName: string | undefined;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, closeModal, userName }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.usermodelmodal}>
            <span className={styles.close} onClick={closeModal}>&times;</span>
            <div className={styles['usermodal-content']}>
                <h1>{userName}</h1>
                <Logout />
            </div>
        </div>
    );
};

export default UserModal;
