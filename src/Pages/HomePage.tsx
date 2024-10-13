// src/Pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import { ToDo } from '../Models/ToDo';
import { Status } from '../Models/Status';
import styles from '../Styles/Home.module.css'; // Import styles via CSS Modules
import { useNavigate } from '@tanstack/react-router'; // Use the useNavigate hook for redirection
import { ToDoViewModel } from '../Models/ToDoViewModel';

const HomePage: React.FC = () => {
    const currentDate: Date = new Date();
    const [todos, setTodos] = useState<ToDo[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(currentDate.toISOString().substring(0, 10)); // ISO format for date
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchTodos(); // Fetch To-Dos on initial load
    }, []);

    // Function to fetch To-Dos
    const fetchTodos = async () => {
        try {
            const response = await fetch('http://localhost:5144/api/todo/todos');
            if (!response.ok) throw new Error('Failed to fetch To-Dos');
            const data = await response.json();
            console.log("Fetched To-Dos:", data); // Check the fetched To-Dos
            setTodos(data);
        } catch (error) {
            setError('Error fetching To-Dos.');
            console.error(error);
        }
    };

    // Create a new To-Do
    const handleCreateTodo = async () => {
        const model: ToDoViewModel = {
            Title: title,
            Description: description,
            Deadline: new Date(deadline).toISOString(),
        };

        try {
            const response = await fetch('http://localhost:5144/api/todo/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(model),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error creating To-Do: ${errorData}`);
            }

            const data = await response.json();
            console.log("To-Do created successfully:", data);
            setSuccess('To-Do created successfully!');
            fetchTodos(); // Refresh the To-Do list
            closeModal(); // Close the modal
        } catch (error) {
            console.error("Error:", error);
            setError('Error creating To-Do.');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        setDeadline(currentDate.toISOString().substring(0, 10)); // Reset the date
        setError(null);
        setSuccess(null);
    };

    return (
        <div className={styles.homepage}>
            <div className={styles.header}>
                <button onClick={() => setIsModalOpen(true)}>Create a To-Do</button>
            </div>

            <div className={styles['main-content']}>
                {error && <div>{error}</div>}
                {success && <div>{success}</div>}

                {isModalOpen && (
                    <div className={styles.modal}>
                        <div className={styles['modal-content']}>
                            <span className={styles.close} onClick={closeModal}>&times;</span>
                            <h3>Create a To-Do</h3>
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <input
                                type="date"
                                placeholder="Deadline"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                            <button onClick={handleCreateTodo}>Create</button>
                        </div>
                    </div>
                )}

                <ul className={styles['todo-list']}>
                    {todos.map((todo) => (
                        <li key={todo.id}>
                            <h3>{todo.title}</h3>
                            <p>{todo.description}</p>
                            <p><strong>Deadline:</strong> {new Date(todo.deadline).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default HomePage;
