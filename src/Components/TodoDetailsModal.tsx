import React from 'react';
import { ToDo } from '../Models/ToDo';
import styles from '../Styles/Home.module.css';
import { Status } from '../Models/Status';

interface TodoDetailsModalProps {
    isOpen: boolean;
    closeModal: () => void;
    selectedTodo: ToDo | null;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    handleUpdateTodo: (todo: ToDo) => Promise<void>;
    handleDeleteTodo: (todo: ToDo) => Promise<void>;
    handleChangeStatus: (todoId: number, newStatus: Status) => Promise<void>;
    setSelectedTodo: (todo: ToDo) => void; // Ajoutez cette ligne
}

const TodoDetailsModal: React.FC<TodoDetailsModalProps> = ({
    isOpen,
    closeModal,
    selectedTodo,
    isEditing,
    setIsEditing,
    handleUpdateTodo,
    handleDeleteTodo,
    handleChangeStatus,
    setSelectedTodo // Ajoutez cette ligne ici
}) => {
    if (!isOpen || !selectedTodo) return null;

    return (
        <div className={styles.modal}>
            <div className={styles['modal-content']}>
                <span className={styles.close} onClick={closeModal}>&times;</span>
                <form>
                    <h3>{isEditing ? 'Edit To-Do' : 'To-Do Details'}</h3>
                    <input
                        type="text"
                        value={selectedTodo.title}
                        onChange={(e) => setSelectedTodo({ ...selectedTodo, title: e.target.value })} // Correction ici
                        disabled={!isEditing}
                    />
                    <input
                        type="text"
                        value={selectedTodo.description}
                        onChange={(e) => setSelectedTodo({ ...selectedTodo, description: e.target.value })} // Correction ici
                        disabled={!isEditing}
                    />
                    <input
                        type="datetime-local"
                        value={new Date(selectedTodo.deadline).toISOString().slice(0, 16)}
                        onChange={(e) => setSelectedTodo({ ...selectedTodo, deadline: e.target.value })} // Correction ici
                    />

                    <div className={styles['button-container']}>
                        {isEditing ? (
                            <>
                                <button className={styles['cancel']} onClick={() => setIsEditing(false)}>Cancel</button>
                                <button className={styles['save']} onClick={() => handleUpdateTodo(selectedTodo)}>Save</button>
                            </>
                        ) : (
                            <>
                                <button className={styles['delete']} onClick={() => handleDeleteTodo(selectedTodo)}>Delete</button>
                                <button className={styles['cancel']} onClick={() => handleChangeStatus(selectedTodo.id, Status.Cancelled)}>Cancel</button>
                                <button className={styles['edit']} onClick={() => setIsEditing(true)}>Edit</button>
                                <button className={styles['cancel']} onClick={() => handleChangeStatus(selectedTodo.id, Status.Done)}>Done</button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TodoDetailsModal;
