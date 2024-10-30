import React from 'react';
import styles from '../Styles/InputField.module.css';

interface InputFieldProps {
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    required?: boolean;
    pattern?: string;
    error?: string | null;
}

const InputField: React.FC<InputFieldProps> = ({ type, value, onChange, placeholder, required,pattern, error }) => {
    return (
        <div className={styles.iconInput}>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                pattern={pattern}
                required={required}
                className={styles.inputField}
            />
            {error && <span className={styles.textDanger}>{error}</span>}
        </div>
    );
};

export default InputField;
