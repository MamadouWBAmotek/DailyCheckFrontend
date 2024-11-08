// components/ToDoItem.tsx
import React, { useEffect, useState } from 'react';
import { ToDo } from '../Models/ToDo';
import styles from '../Styles/TodoItem.module.css';

interface ToDoItemProps {
    todo: ToDo;
    onClick: () => void;
    isAdminUser: boolean;
    showMyToDos: boolean;
    userId:string;
    

}

const ToDoItem: React.FC<ToDoItemProps> = ({ todo, onClick, isAdminUser, showMyToDos,userId }) => {
    const [changeBgColor, setChangeBgColor] = useState<boolean>(false);
    useEffect(() => {
        if (new Date(todo.deadline) < new Date()) {
            setChangeBgColor(true);
        }
    }, [todo.deadline]);
    return (
        <li>
            <button className={styles['todo-item']} onClick={onClick}>
                {/* <div className={styles['todo-title']}>

                </div> */}


                <div className={styles[changeBgColor?'todoitem-expired':'todoitem-content']}>

                    <div>
                        <h1 >{todo.title}</h1>
                        {isAdminUser && !showMyToDos ? <h1> Created by: {userId==todo.userId? "You":todo.userEmail}</h1> : ''}
                    </div>
                    <h1 className={styles[changeBgColor?'dealinetored':'']}>{new Date(todo.deadline).toLocaleString()}</h1>

                    {/* <p>Created by </p><h1>{todo.userEmail}</h1>
                    <p>Description</p> <h1>{todo.description}</h1> */}

                </div>
            </button>
        </li>
    );
};

export default ToDoItem;
