import React, { useState } from "react";
import styles from '../Styles/CreateModal.module.css'; // Assurez-vous que le chemin est correct
import { registerUser } from "../Utils/RegisterUser";
import { Role } from "../Models/Roles";

interface CreateUserModalProps {
    isOpen: boolean;
    triggerUpdate: boolean;
    setTriggerUpdate: (triggerUpdate: boolean) => void;
    closeModal: () => void;
    userName: string;
    setUserName: (userName: string) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (confirmPassword: string) => void;
    role: Role;
    setRole: (role: Role) => void;
    succes: string | null;
    setSucces: (succes: string) => void;
    error: string | null;
    setError: (error: string) => void;
    handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;

}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
    isOpen, closeModal, triggerUpdate, setTriggerUpdate,
    userName, setUserName, email,
    setEmail, password, setPassword,
    confirmPassword, setConfirmPassword,
    role, setRole, succes, setSucces, error, setError, handleOverlayClick }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleCreateUser = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await registerUser(userName, email, password, confirmPassword, role);
        if (result.error) {
            console.log(error)
            setError(result.error);
            setIsSubmitting(false);
        } else if (result.user) {
            setSucces(`User "${userName}" created succesfully!`);
            closeModal();
            setTimeout(() => {
                setSucces('');
            }, 2000); setIsSubmitting(false)
        }
    };

    return (
        <div className={styles.modal} onClick={handleOverlayClick}>
            <div className={styles['modal-content']}>
                <span className={styles.close} onClick={closeModal}>&times;</span>
                <form onSubmit={handleCreateUser}>
                    <h3>Create User</h3>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Username" required />
                    <input type="email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" value={email}
                        onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm Password" />
                    <select name="Roles" id="Roles"
                        onChange={(e) => setRole(parseInt(e.target.value) as Role)}
                    >
                        <option value={Role.User}>User</option>
                        <option value={Role.Admin}>Admin</option>
                    </select>
                    <div style={{ display: "flex" }}>
                        {error && <p style={{ color: 'red', margin: '20px auto' }}>{error}</p>}

                    </div>

                    <button style={{ alignSelf: "flex-end" }} type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</button>
                </form>
            </div>
        </div>







    );
};

export default CreateUserModal;