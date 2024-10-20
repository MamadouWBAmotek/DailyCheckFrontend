import React, { useState, useEffect } from 'react';
import { ToDo } from '../Models/ToDo';
import { Status } from '../Models/Status';
import styles from '../Styles/Home.module.css'; // Importation des styles CSS Modules
import { useAuth } from '../Components/Auth';
import { ToDoViewModel } from '../Models/ToDoViewModel';

const HomePage: React.FC = () => {
    const [todos, setTodos] = useState<ToDo[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isToDoModalOpen, setIsToDoModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<ToDo | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
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
    // Fermer le modal
    const closeModal = () => {
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        setDeadline('');
        setError(null);
        setSuccess(null);
    };
    // Gestion de la création d'un nouveau To-Do
    const handleCreateTodo = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!title || !description || !deadline) {
            setError('Please fill in all fields');
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
                closeModal(); // Ferme le modal après la création
                const data = await response.json();
                setSuccess(`To-Do "${data.todo.title}" created successfully!`);
                fetchTodos(); // Rafraîchit la liste des To-Dos
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to create To-Do');
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(`Error: ${error.message}`);
            } else {
                setError('Unknown error occurred.');
            }
        }
    };
    const ShowTodoDetails = (todo: ToDo) => {
        setSelectedTodo(todo); // Définit le To-Do sélectionné
        console.log(todo)
        setIsEditing(false);
        setIsToDoModalOpen(true); // Ouvre le modal
    };

    const closeToDoModal = () => {
        setIsToDoModalOpen(false);

    };
    const handleEditTodo = (todoId: number) => {
        // setSelectedTodo(todo); // Définit le To-Do sélectionné
        // setIsToDoModalOpen(true); // Ouvre le modal
    };
    const handleDeleteTodo = async (todo: ToDo) => {
        if (!todo) return; // Vérifie si un To-Do est bien sélectionné

        const confirmDelete = window.confirm(`Are you sure you want to delete the To-Do "${todo.title}"?`);
        if (!confirmDelete) return; // Si l'utilisateur annule la suppression, on arrête ici

        try {
            const response = await fetch('http://localhost:5144/api/todo/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todo), // Envoie le To-Do complet dans le corps de la requête
            });

            if (response.ok) {
                setSuccess(`To-Do "${todo.title}" deleted successfully!`); // Message de succès
                fetchTodos(); // Rafraîchit la liste des To-Dos après suppression
                closeToDoModal(); // Ferme le modal après la suppression
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to delete To-Do'); // Message d'erreur personnalisé
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(`Error: ${error.message}`); // Gère les erreurs connues
            } else {
                setError('Unknown error occurred while deleting the To-Do.'); // Gère les erreurs inconnues
            }
        }
    };

    const handleCancelTodo = async (todo: ToDo) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this To-Do?');
        if (!confirmCancel) return;

        setIsLoading(true); // Indicateur de chargement

        try {
            const response = await fetch(`http://localhost:5144/api/todo/cancel`, {
                method: 'PATCH', // Utilisation de PATCH pour modifier l'état du To-Do
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                setSuccess('To-Do cancelled successfully!');
                fetchTodos(); // Rafraîchit la liste des To-Dos
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to cancel To-Do');
            }
        } catch (error) {
            setError('Error cancelling To-Do.');
            console.error(error);
        } finally {
            setIsLoading(false); // Fin du chargement
        }
    };
    const handleUpdateTodo = async (todo: ToDo) => {
        if (!todo) return; // Si aucun To-Do sélectionné, ne rien faire
        const formattedDeadline = new Date(todo.deadline).toISOString();

        const updatedModel: ToDo = {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            userId: user?.id.toString() || '', // Utilise l'ID utilisateur à partir du contexte
            deadline: formattedDeadline,
            Status: todo.Status // Formatte la date
        };

        try {
            const response = await fetch('http://localhost:5144/api/todo/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedModel),
            });

            if (response.ok) {
                const result = await response.json();
                setSuccess(`To-Do "${updatedModel.title}" updated successfully!`);
                fetchTodos(); // Rafraîchit la liste des To-Dos après mise à jour
                closeToDoModal(); // Ferme le modal après la mise à jour
                console.log("model closed");
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update To-Do');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(`Error: ${error.message}`);
            } else {
                setError('Unknown error occurred.');
            }
        }
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
                                <button className={styles['todo-item']} onClick={() => ShowTodoDetails(todo)}>
                                    <div className={styles['todoitem-content']}> {/* Utilisation du style du modal */}
                                        <h3>{todo.title}</h3>
                                        <p>{todo.description}</p>
                                        <p>{new Date(todo.deadline).toLocaleString()}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                    {isToDoModalOpen && selectedTodo && ( // Vérifie si le modal est ouvert et si un To-Do est sélectionné
                        <div className={styles.modal}>
                            <div className={styles['modal-content']}>
                                <span className={styles.close} onClick={closeToDoModal}>&times;</span>
                                <form>
                                    <h3>{isEditing ? 'Edit To-Do' : 'To-Do Details'}</h3>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={selectedTodo?.title || ''} // Utilise le titre du To-Do sélectionné
                                        onChange={(e) => {
                                            if (selectedTodo) {
                                                setSelectedTodo({ ...selectedTodo, title: e.target.value }); // Met à jour le titre du To-Do sélectionné
                                            }
                                        }}
                                        required
                                        disabled={!isEditing}
                                        autoFocus={isEditing} />
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={selectedTodo.description}
                                        onChange={(e) => {
                                            if (selectedTodo) {
                                                setSelectedTodo({ ...selectedTodo, description: e.target.value }); // Met à jour la description du To-Do sélectionné
                                            }
                                        }}
                                        required
                                        disabled={!isEditing} />
                                    <input
                                        type="datetime-local"
                                        value={new Date(selectedTodo.deadline).toISOString().slice(0, 16)} // Format YYYY-MM-DDTHH:MM
                                        onChange={(e) => {
                                            if (selectedTodo) {
                                                setSelectedTodo({ ...selectedTodo, deadline: e.target.value });
                                            }
                                        }}
                                    />


                                    {/* Boutons pour Edit, Cancel et Delete */}
                                    <div className={styles['button-container']}>
                                        {isEditing ? (
                                            <>
                                                <button type="button" onClick={() => handleUpdateTodo(selectedTodo)}>Save</button>
                                                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button type="button" onClick={() => setIsEditing(true)}>Edit Todo</button>
                                                <button type="button" onClick={() => handleDeleteTodo(selectedTodo)}>Delete Todo</button>
                                                <button type="button" onClick={() => handleCancelTodo(selectedTodo)}>Cancel Todo</button>

                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

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
