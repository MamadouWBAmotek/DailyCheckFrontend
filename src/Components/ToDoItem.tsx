// components/ToDoItem.tsx
import React, { useEffect, useState } from 'react';
import { ToDo } from '../Models/ToDo';
import styles from '../Styles/TodoItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

interface ToDoItemProps {
    todo: ToDo;
    ShowTodoDetails: (todo: ToDo) => void;
    isAdminUser: boolean;
    showMyToDos: boolean;
    userId: string;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    handleDeleteTodo: (todo: ToDo) => Promise<void>;

}

const ToDoItem: React.FC<ToDoItemProps> = ({ todo, ShowTodoDetails, isAdminUser, showMyToDos, userId, isEditing, setIsEditing, handleDeleteTodo }) => {
    const [changeBgColor, setChangeBgColor] = useState<boolean>(false);
    useEffect(() => {
        if (new Date(todo.deadline) < new Date()) {
            setChangeBgColor(true);
        }
    }, [todo.deadline]);
    return (
        <li className={styles['todo-itemli']}>
            <button className={styles['todo-item']} onClick={() => ShowTodoDetails(todo)}>
                {/* <div className={styles['todo-title']}>

                </div> */}
                <table className={styles['table']}>
                    <td style={{ width: '20%' }}>{todo.title}</td>
                    <td style={{ width: '30%' }}>{!showMyToDos && isAdminUser ? todo.userEmail : todo.description}</td>
                    {/* {(!showMyToDos && isAdminUser) && <td style={{ width: '20%' }}>{todo.userEmail}</td>
                    } */}
                    <td style={{ width: '30%' }}>{new Date(todo.deadline).toISOString().slice(0, 16)}</td>
                </table>
            </button>
            <td style={{ width: '10%', textAlign: 'center' }}>

                <button className={styles['delete']} onClick={(e) => { e.preventDefault(); handleDeleteTodo(todo); }}>
                    <FontAwesomeIcon icon={faTrash} size='xl' />
                </button>
            </td>
            <td style={{ width: '10%', textAlign: 'center' }}>
                <button type='button' className={styles['edit']} onClick={() => { ShowTodoDetails(todo); setIsEditing(true); }}>
                    <FontAwesomeIcon icon={faPenToSquare} size='xl' />
                </button>
            </td>
            {/* <div className={styles[changeBgColor ? 'todoitem-expired' : 'todoitem-content']}>

                    <div>
                        <h1 >{todo.title}</h1>
                        {isAdminUser && !showMyToDos ? <h1> Created by: {userId == todo.userId ? "You" : todo.userEmail}</h1> : ''}
                    </div>
                    <h1 className={styles[changeBgColor ? 'dealinetored' : '']}>{new Date(todo.deadline).toLocaleString()}</h1>

                    {/ <p>Created by </p><h1>{todo.userEmail}</h1>
                    <p>Description</p> <h1>{todo.description}</h1> /}

                </div> */}

            {/* <div style={{
                width: '10%', display: 'flex', marginBottom: '3px', justifyContent: 'space-between',
                alignItems: 'center', padding: '20px', borderRadius: '10px',
            }}>


                
            </div> */}



        </li>
    );
};

export default ToDoItem;
