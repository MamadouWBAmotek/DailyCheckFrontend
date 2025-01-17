import React from 'react';
import styles from '../Styles/CreateModal.module.css'; // Assurez-vous que le chemin est correct

interface CreateTodoModalProps {
    isOpen: boolean;
    closeModal: () => void;
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    deadline: string;
    setDeadline: (deadline: string) => void;
    handleCreateTodo: (e: React.FormEvent) => Promise<void>;
    handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;

}

const CreateTodoModal: React.FC<CreateTodoModalProps> = ({
    isOpen, closeModal, title, setTitle,
    description, setDescription,
    deadline, setDeadline, handleCreateTodo,
    handleOverlayClick }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modal} onClick={handleOverlayClick}>
            <div className={styles['modal-content']}>
                <span className={styles.close} onClick={closeModal}>&times;</span>
                <form onSubmit={handleCreateTodo}>
                    <h3>Create To-Do</h3>
                    <input autoFocus type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Title" />
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Description" />
                    <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                    <button type='submit'>Create</button>
                </form>
            </div>
        </div>
    );
};

export default CreateTodoModal;
