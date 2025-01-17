import React from 'react';
import { ToDo } from '../Models/ToDo';
import styles from '../Styles/ToDoDetailsModal.module.css';
import { Status } from '../Models/Status';
import { setegid } from 'process';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash, faCheck, faXmark, faPenToSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { useFetchTodosByStatus } from '../Hooks/useFetchTodos';
interface TodoDetailsModalProps {
    isOpen: boolean;
    closeModal: () => void;
    selectedTodo: ToDo | null;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    handleUpdateTodo: (e: React.FormEvent, todo: ToDo) => Promise<void>;
    handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    setSelectedTodo: (todo: ToDo) => void; // Ajoutez cette ligne
}

const TodoDetailsModal: React.FC<TodoDetailsModalProps> = ({
    isOpen,
    closeModal,
    selectedTodo,
    isEditing,
    setIsEditing,
    handleUpdateTodo,

    handleOverlayClick,
    setSelectedTodo // Ajoutez cette ligne ici
}) => {
    if (!isOpen || !selectedTodo) return null;

    return (
        <div className={styles.modal} onClick={handleOverlayClick}>
            <div className={styles['modal-content']}>
                <span className={styles.close} onClick={closeModal}>&times;</span>
                <h1 style={{ textAlign: 'center', width: '100%' }}>{isEditing ? `Edit ${Status[selectedTodo.status]} To-Do` : `${Status[selectedTodo.status]} To-Do Details`}</h1>
                <form>
                    <label htmlFor="title">Title</label>
                    <input
                        autoFocus={isEditing}
                        type="text"
                        value={selectedTodo.title}
                        onChange={(e) => setSelectedTodo({ ...selectedTodo, title: e.target.value })}
                        disabled={!isEditing}
                        placeholder='Title'
                    />
                    <label htmlFor="description">Description</label>
                    <textarea
                        rows={selectedTodo.description.length >= 150 ?
                            ((selectedTodo.description.length * 2) / 150) % 1 !== 0 ? ((selectedTodo.description.length * 2) / 150) + 1 : 0 : 2

                        }

                        value={selectedTodo.description}
                        onChange={(e) => setSelectedTodo({ ...selectedTodo, description: e.target.value })}
                        disabled={!isEditing}
                        placeholder='Description'

                    />
                    <label htmlFor="deadline">Deadline</label>
                    <input
                        type="datetime-local"
                        disabled={!isEditing}
                        value={selectedTodo.deadline.slice(0, 19)}
                        onChange={(e) => setSelectedTodo({ ...selectedTodo, deadline: e.target.value })}
                    />

                    <div className={styles['button-container']}>
                        {isEditing && (
                            <>
                                <button title='Go back' className={styles['cancel']} onClick={(e) => { setIsEditing(false)}}><FontAwesomeIcon icon={faArrowLeft} color='orange'></FontAwesomeIcon></button>
                                <button title='Save' type='submit' className={styles['save']} onClick={(e) => {  handleUpdateTodo(e,selectedTodo) }}><FontAwesomeIcon icon={faCheck} color='green'></FontAwesomeIcon></button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TodoDetailsModal;
