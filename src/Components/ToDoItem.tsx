// components/ToDoItem.tsx
import React, { useEffect, useState } from 'react';
import { ToDo } from '../Models/ToDo';
import styles from '../Styles/Item.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faSquareCheck, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Status } from '../Models/Status';

interface ToDoItemProps {
    todo: ToDo;
    ShowTodoDetails: (todo: ToDo) => void;
    isAdminUser: boolean;
    showMyToDos: boolean;
    userId: string;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    handleDeleteTodo: (todo: ToDo) => Promise<void>;
    handleChangeStatus: (todo: ToDo, newStatus: Status) => Promise<void>;
}
const ToDoItem: React.FC<ToDoItemProps> = ({ todo, ShowTodoDetails, setIsEditing, handleDeleteTodo, handleChangeStatus }) => {
    const [changeBgColor, setChangeBgColor] = useState<boolean>(false);

    const today = new Date(Date.now());
    const aDayBefore = new Date(todo.deadline); // Crée un objet Date
    aDayBefore.setDate(aDayBefore.getDate() - 1); // Modifie la date
    const aDayBeforeTheDealine = new Date(aDayBefore);
    // aDayBeforeTheDealine
    // const isItAlmostExpired = 
    ;
    useEffect(() => {

        if (todo.status != Status.Done && todo.status != Status.Cancelled && aDayBeforeTheDealine.toString() <= today.toString()) {
            setChangeBgColor(true);
        }
    }, [todo.deadline]);
    return (
        <div className={changeBgColor ? styles['todo-itemli-whilealmostexpired'] : styles['todo-itemli']}>
            <div style={{ width: '100%', display: 'flex' }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '10%', }}>
                    <button title='Edit Task' type='button' className={styles['edit']} onClick={() => { ShowTodoDetails(todo); setIsEditing(true); }}>
                        <FontAwesomeIcon icon={faPenToSquare} size='xl' />
                    </button>
                    <button title='Cancel Task' className={styles['cancel']} onClick={() => handleChangeStatus(todo, Status.Cancelled)}><FontAwesomeIcon icon={faXmark} size='xl' color='orange' /></button>
                </div>

                <div onClick={() => ShowTodoDetails(todo)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '80%', textAlign: 'center' }}>
                    <h1><b> {todo.title.toLocaleUpperCase()}</b></h1>
                    <p> <b style={{ textDecoration: 'underline' }}> Description</b>{': '}
                        {todo.description.length >= 30 ? (<>
                            {todo.description.substring(0, 30)}...{''}
                        </>) : (todo.description)}</p>
                    <p> <b style={{ textDecoration: 'underline' }}> Deadline</b>{': '}  {todo.deadline.toString().substring(0, 10)} at <strong style={{ color: changeBgColor ? 'orange' : '' }}>{todo.deadline.toString().substring(11, 16)}</strong> </p>

                </div>


                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '10%', }}>
                    <button title='Delete Task' className={styles['delete']} onClick={(e) => { e.preventDefault(); handleDeleteTodo(todo); }}>
                        <FontAwesomeIcon icon={faTrash} size='xl' />
                    </button>
                    <button title='Task Done' className={styles['done']} onClick={() => handleChangeStatus(todo, Status.Done)}><FontAwesomeIcon icon={faSquareCheck} size='xl' color='green' /></button>
                </div>
            </div>
        </div >
    );
};

export default ToDoItem;
