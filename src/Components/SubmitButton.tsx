import React from 'react';
import styles from '../Styles/SubmitButton.module.css';

interface SubmitButtonProps {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label, onClick, disabled }) => {
    return (
        <div className={styles.buttonContainer}>
            <button className={styles.submitButton} onClick={onClick} disabled={disabled}>
                {label}
            </button>
        </div>
    );
};

export default SubmitButton;
