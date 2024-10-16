import React, { useState, useEffect } from 'react';
import { ToDo } from '../Models/ToDo';
import { Status } from '../Models/Status';
import styles from './HomePage.module.css'; // Importing styles from CSS Modules
import { Navigate } from '@tanstack/react-router';

const HomePage: React.FC = () => {
    const [todos, setTodos] = useState<ToDo[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTodo, setNewTodo] = useState<{ title: string; description: string; deadline: string }>({
        title: '',
        description: '',
        deadline: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchTodos(); // Fetch all To-Dos on initial load
    }, []);

    // Fetch To-Dos with filtering by status
    const fetchTodos = async (status?: Status) => {
        let url = 'http://localhost:5144/api/todo/todos';
        if (status) {
            url += `?status=${status}`;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch To-Dos');
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            setError('Error fetching To-Dos.');
            console.error(error);
        }
    };

    // Filter To-Dos by status
    const filterByStatus = (status: Status) => {
        fetchTodos(status);
    };
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5144/api/login/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Mettez à jour l'état d'authentification ici, par exemple en utilisant un contexte ou un état global
                // setIsAuth(false); // Décommentez ceci si vous utilisez un état pour l'authentification

                Navigate({ to: '/login' }); // Redirection vers la page de connexion ou une autre page
            } else {
                const errorData = await response.json();
                console.error('Logout failed:', errorData.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    // Create a new To-Do
    const handleCreateTodo = async () => {
        try {
            const response = await fetch('http://localhost:5144/api/todo/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newTodo, status: Status.Upcoming }), // Add default status
            });

            if (!response.ok) throw new Error('Error creating To-Do');

            setSuccess('To-Do created successfully!');
            fetchTodos();
            closeModal();
        } catch (error) {
            setError('Error creating To-Do.');
            console.error(error);
        }
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setNewTodo({ title: '', description: '', deadline: '' }); // Reset fields
        setError(null);
        setSuccess(null);
    };

    return (
        <div className={styles.homepage}>
            <div className={styles.header}>
                <button onClick={() => setIsModalOpen(true)}>Create To-Do </button>
                <button onClick={() => alert('Generate To-Do with ChatGPT feature not implemented.')}>Create To-Do/s with ChatGPT</button>
                <button onClick={handleLogout}>Logout </button>

            </div>

            <div className={styles.sidebar}>
                <h3>ToDo's</h3>
                <ul>
                    <li onClick={() => filterByStatus(Status.Done)}>Done</li>
                    <li onClick={() => filterByStatus(Status.Cancelled)}>Cancelled</li>
                    <li onClick={() => filterByStatus(Status.Upcoming)}>Upcoming</li>
                </ul>
            </div>

            <div className={styles['main-content']}>
                {/* Display error or success messages */}
                {error && <div>{error}</div>}
                {success && <div>{success}</div>}

                {/* Modal for creating a new To-Do */}
                {isModalOpen && (
                    <div className={styles.modal}>
                        <div className={styles['modal-content']}>
                            <span className={styles.close} onClick={closeModal}>&times;</span>
                            <h3>Create To-Do</h3>
                            <input
                                type="text"
                                placeholder="Title"
                                value={newTodo.title}
                                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={newTodo.description}
                                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                            />
                            <input
                                type="date"
                                placeholder="Deadline"
                                value={newTodo.deadline}
                                onChange={(e) => setNewTodo({ ...newTodo, deadline: e.target.value })}
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
