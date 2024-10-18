import React, { useState, useEffect } from 'react';
import { ToDo } from '../Models/ToDo';
import { Status } from '../Models/Status';
import styles from '../Styles/Home.module.css'; // Importation des styles CSS Modules
import { useAuth } from '../Components/Auth';
import { ToDoViewModel } from '../Models/ToDoViewModel';

const HomePage: React.FC = () => {
    const [todos, setTodos] = useState<ToDo[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [deadline, setDeadline] = useState<string>('');
    const [status, setStatus] = useState<Status>(Status.Upcoming);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Ajout d'un indicateur de chargement
    const { user } = useAuth();

    useEffect(() => {
        fetchTodos(); // Appel initial pour récupérer les To-Dos
    }, []);

    // Fonction pour récupérer les To-Dos avec un filtre par statut
    const fetchTodos = async () => {
        setIsLoading(true); // Commence le chargement

        try {
            const response = await fetch('http://localhost:5144/api/todo/todos');
            const data = await response.json();
            if (response.status === 404 && data.message == "No To-Dos found.") {
                setError("No cancelled To-Dos found.");;
                throw new Error("No To-Dos found.")
                console.error(error);
            }
            setTodos(data.todos);
            setError(null); // Réinitialisation des erreurs
        } catch (error) {
            setError('Error fetching To-Dos.');
            console.error(error);
        } finally {
            setIsLoading(false); // Fin du chargement
        }
    };

    // Fonction pour filtrer les To-Dos par statut
    // const filterByStatus = (status: Status) => {
    //     fetchTodos(status);
    // };

    // Gestion de la déconnexion
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5144/api/login/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                window.location.href = '/login'; // Redirection vers la page de connexion
            } else {
                const errorData = await response.json();
                console.error('Logout failed:', errorData.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const fetchUpcomingTodos = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5144/api/todo/todos/upcoming');
            const data = await response.json();

            if (response.status === 404 && data.message == "No upcoming To-Dos found.") {

                setError("No upcoming To-Dos found.");;
                throw new Error("No upcoming To-Dos found.")
                console.error(error);

            }
            setTodos(data.todos);
            setError(null); // Réinitialisation des erreurs
        } catch (error) {
            setError('Error fetching upcoming To-Dos.');
            console.error(error);
        } finally {
            setIsLoading(false); // Fin du chargement
        }
    };
    const fetchDoneTodos = async () => {
        setTodos([]);
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5144/api/todo/todos/done');
            const data = await response.json();
            setTodos(data.todos);
            if (response.status === 404 && data.message == "No done To-Dos found.") {

                setError("No done To-Dos found.");;
                throw new Error("No done To-Dos found.")
            }
            setError(null); // Réinitialisation des erreurs
        } catch (error) {
            setError('Error fetching done To-Dos.');
            console.error(error);
        } finally {
            setIsLoading(false); // Fin du chargement
        }
    };
    const fetchCancelledTodos = async () => {
        setTodos([]);

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5144/api/todo/todos/cancelled');
            const data = await response.json();

            if (response.status === 404 && data.message == "No cancelled To-Dos found.") {

                setError("No cancelled To-Dos found.");;
                throw new Error('"No cancelled To-Dos found."')
                console.error(error);

            }
            setTodos(data.todos);

            setError(null); // Réinitialisation des erreurs
        } catch (error) {
            // setError('Error fetching cancelled To-Dos.');
            console.error(error);
        } finally {
            setIsLoading(false); // Fin du chargement
        }
    };

    // Gestion de la création d'un nouveau To-Do
    const handleCreateTodo = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!title || !description || !deadline) {
            setError('Please fill in all fields');
            return;
        }

        const formattedDeadline = new Date(deadline).toISOString();
        const model: ToDoViewModel = {
            Title: title,
            Description: description,
            UserId: user?.id.toString() || '', // Utilise l'ID utilisateur à partir du contexte
            Deadline: formattedDeadline,
        };

        try {
            const response = await fetch('http://localhost:5144/api/todo/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(model),
            });

            if (response.ok) {
                const result = await response.json();
                setSuccess(`To-Do "${result.title}" created successfully!`);
                fetchTodos(); // Rafraîchit la liste des To-Dos
                closeModal(); // Ferme le modal après la création
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to create To-Do');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(`Error: ${error.message}`);
            } else {
                setError('Unknown error occurred.');
            }
        }
    };

    // Fermer le modal
    const closeModal = () => {
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        setDeadline('');
        setError(null);
        setSuccess(null);
    };

    return (
        <div className={styles.homepage}>
            <div className={styles.header}>
                <button onClick={() => setIsModalOpen(true)}>Create To-Do</button>
                <button onClick={() => alert('Generate To-Do with ChatGPT feature not implemented.')}>Create To-Do/s with ChatGPT</button>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div className={styles['main-container']}>
                <div className={styles.sidebar}>
                    <h3>ToDo's</h3>
                    <ul>
                        <li onClick={() => fetchTodos()}>All ToDos</li>
                        <li onClick={() => fetchUpcomingTodos()}>Upcoming</li>
                        <li onClick={() => fetchDoneTodos()}>Done ToDos</li>
                        <li onClick={() => fetchCancelledTodos()}>Cancelled ToDos</li>
                    </ul>
                </div>

                <div className={styles['main-content']}>
                    {/* Affichage de l'indicateur de chargement */}
                    {isLoading && <p>Loading...</p>}

                    {/* Affichage des messages d'erreur ou de succès */}
                    {error && <div className={styles.error}>{error}</div>}
                    {success && <div className={styles.success}>{success}</div>}

                    {/* Liste des To-Dos */}
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

                    {/* Modal pour créer un nouveau To-Do */}
                    {isModalOpen && (
                        <div className={styles.modal}>
                            <div className={styles['modal-content']}>
                                <span className={styles.close} onClick={closeModal}>&times;</span>
                                <form onSubmit={handleCreateTodo}>
                                    <h3>Create To-Do</h3>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="datetime-local"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        required
                                    />
                                    <button type="submit">Create</button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default HomePage;
