// src/Components/ToDoList.tsx
import React from 'react';
import { ToDo } from '../Models/ToDo'; // Assurez-vous d'importer votre modèle ToDo
import styles from '../Styles/Home.module.css'; // Importation des styles CSS Modules

interface ToDoListProps {
    todos: ToDo[];
}

const ToDoList: React.FC<ToDoListProps> = ({ todos }) => {
    return (
        <div>
            <h3>My To-Dos</h3>
            <ul className={styles['todo-list']}>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <h3>{todo.title}</h3>
                        <p>{todo.description}</p>
                        <p>{new Date(todo.deadline).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ToDoList;
