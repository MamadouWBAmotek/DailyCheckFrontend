// components/ToDoItem.tsx
import React from 'react';
import { ToDo } from '../Models/ToDo';
import styles from '../Styles/Home.module.css';

interface ToDoItemProps {
    todo: ToDo;
    onClick: () => void;
}

const ToDoItem: React.FC<ToDoItemProps> = ({ todo, onClick }) => {
    return (
        <li>
            <button className={styles['todo-item']} onClick={onClick}>
                <h1>{todo.title}</h1>
                <div className={styles['todoitem-content']}>
                    <p>{todo.description } {new Date(todo.deadline).toLocaleString()}</p>
                </div>
            </button>
        </li>
    );
};

export default ToDoItem;
