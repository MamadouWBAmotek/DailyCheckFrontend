import React, { useState, useEffect, useRef } from 'react';
import { ToDo } from '../Models/ToDo';
import { Status } from '../Models/Status';
import styles from '../Styles/Home.module.css'; // Importation des styles CSS Modules
import { useAuth } from '../Components/Auth';
import { ToDoViewModel } from '../Models/ToDoViewModel';
import { useFetchTodosByStatus } from '../Hooks/useFetchTodos';
import Logout from '../Components/Logout';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TodoDetailsModal from '../Components/TodoDetailsModal';
import CreateTodoModal from '../Components/CreateTodoModal';
import UserModal from '../Components/UserModal';
import ToDoItem from '../Components/ToDoItem';


const HomePage: React.FC = () => {

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isToDoModalOpen, setIsToDoModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<ToDo | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [deadline, setDeadline] = useState<string>('');
    const [status, setStatus] = useState<Status>(Status.Upcoming);
    const [isDone, setIsDone] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Adding a loading indicator
    const { user, setIsauth, setUser } = useAuth();
    const inputRef = useRef<HTMLInputElement>(null);
    const [triggerUpdate, setTriggerUpdate] = useState(false);

    ///modifacations
    const [userId] = useState(String(user?.id)); // Remplacez 'user123' par l'ID utilisateur approprié
    const [toFetchStatus, setToFetchStatus] = useState<Status | undefined>(undefined);
    const { todos, Fetchingrror } = useFetchTodosByStatus({ userId, toFetchStatus, triggerUpdate });


    const handleStatusChange = (selectedStatus: Status | undefined) => {
        setToFetchStatus(selectedStatus);
        console.log(status)
    };
    // Close the modal
    const closeModal = () => {
        setIsCreateModalOpen(false);
        setTitle('');
        setDescription('');
        setDeadline('');
        setError(null);
        setSuccess(null);
    };

    // Handling the creation of a new To-Do
    const handleCreateTodo = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!title || !description || !deadline) {
            setError('Please fill in all fields');
        }

        const formattedDeadline = new Date(deadline).toISOString();
        const model: ToDoViewModel = {
            Title: title,
            Description: description,
            UserId: user?.id.toString() || '', // Use user ID from context
            Deadline: formattedDeadline,
        };

        try {
            const response = await fetch('http://localhost:5144/api/todo/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(model),
            });
            const data = await response.json();

            if (response.ok) {
                // Close the modal after creation
                setSuccess(`To-Do "${data.todo.title}" created successfully!`);


                setTimeout(() => {
                    closeModal();
                    setTriggerUpdate(true);
                }, 1000);

            }
            else if (response.status == 400 && data.message == "The deadline cannot be in the past.") {
                console.log("the deadline is the past");
                setError("The deadline cannot be in the past.");
            }
            else {
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
        setSelectedTodo(todo); // Set the selected To-Do
        setIsEditing(false);
        setIsToDoModalOpen(true); // Open the modal
    };


    const closeToDoModal = () => {
        setIsToDoModalOpen(false);
    };

    const handleDeleteTodo = async (todo: ToDo) => {

        const confirmChange = window.confirm('Are you sure you want to change the status of this To-Do?');
        if (!confirmChange) return;
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5144/api/todo/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo),
            });
            const data = await response.json();
            if (response.ok) {
                closeToDoModal();
                setSuccess(`To-Do "${todo.title}" deleted successfully!`);
            }

        } catch (error) {
            setError('Error deleting todo!'); // Gère les erreurs lors de la requête.
        } finally {
            setIsLoading(false); // Arrête l'indicateur de chargement.
        }
    };

    const handleChangeStatus = async (todoId: number, newStatus: Status) => {
        const confirmChange = window.confirm('Are you sure you want to change the status of this To-Do?');
        if (!confirmChange) return; // Si l'utilisateur annule, on sort de la fonction.

        setIsLoading(true); // Démarre l'indicateur de chargement.

        const requestBody = {
            TodoId: todoId,
            NewStatus: newStatus,
        };

        try {
            const response = await fetch('http://localhost:5144/api/todo/changestatus', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });
            console.log(requestBody);
            const data = await response.json(); // Récupère la réponse JSON.

            // Gestion des réponses en fonction du statut
            if (response.status === 400 && data.message === "To-Do item already cancelled") {
                setError("To-Do item already cancelled"); // Message d'erreur spécifique.
            } else if (response.ok) {
                setSuccess("To-Do's status successfully changed!");
                closeToDoModal(); // Ferme le modal si l'opération réussit.
                // Vous pouvez ici recharger les To-Dos si nécessaire.

            } else {
                // Si la réponse n'est pas ok, affiche une erreur générale.
                setError(data.message || 'Failed to change To-Do status');
            }
        } catch (error) {
            setError('Error changing To-Do status.'); // Gère les erreurs lors de la requête.
        } finally {
            setIsLoading(false); // Arrête l'indicateur de chargement.
        }
    };

    const handleUpdateTodo = async (todo: ToDo) => {

        console.log(todo);
        const formattedDeadline = new Date(todo.deadline).toISOString()

        try {
            const response = await fetch('http://localhost:5144/api/todo/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo),
            });

            if (response.ok) {
                setSuccess(`To-Do "${todo.title}" updated successfully!`);
                closeToDoModal();
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
                <button onClick={() => setIsCreateModalOpen(true)}>Create To-Do</button>
                <button onClick={() => setIsUserModalOpen(true)}><FontAwesomeIcon icon={faUser}></FontAwesomeIcon></button>
            </div>

            <div className={styles['main-container']}>
                <div className={styles.sidebar}>
                    <h3>ToDo's</h3>
                    <ul>
                        <li onClick={() => handleStatusChange(undefined)}>All ToDos</li>
                        <li onClick={() => handleStatusChange(Status.Upcoming)}>Upcoming</li>
                        <li onClick={() => handleStatusChange(Status.Done)}>Done ToDos</li>
                        <li onClick={() => handleStatusChange(Status.Cancelled)}>Cancelled ToDos</li>
                    </ul>
                </div>

                <div className={styles['main-content']}>
                    <h1>My {toFetchStatus !== undefined ? Status[toFetchStatus] : ""} To-Dos</h1>

                    {isLoading && <p>Loading...</p>}
                    {Fetchingrror && <p style={{ color: 'red' }}>{Fetchingrror}</p>}
                    {success && <div className={styles.success}>{success}</div>}

                    <ul className={styles['todo-list']}>
                        {todos.length > 0 ? (
                            todos.map(todo => (
                                <ToDoItem key={todo.id} todo={todo} onClick={() => ShowTodoDetails(todo)} />
                            ))
                        ) : (
                            <p>No To-Dos found.</p>
                        )}
                    </ul>

                    <CreateTodoModal
                        isOpen={isCreateModalOpen}
                        closeModal={closeModal}
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        deadline={deadline}
                        setDeadline={setDeadline}
                        handleCreateTodo={handleCreateTodo}
                    />

                    <TodoDetailsModal
                        isOpen={isToDoModalOpen}
                        closeModal={closeToDoModal}
                        selectedTodo={selectedTodo}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        handleUpdateTodo={handleUpdateTodo}
                        handleDeleteTodo={handleDeleteTodo}
                        handleChangeStatus={handleChangeStatus}
                        setSelectedTodo={setSelectedTodo} // Ajoutez cette ligne
                    />
                    <UserModal
                        isOpen={isUserModalOpen}
                        closeModal={() => setIsUserModalOpen(false)}
                        userName={user?.userName}
                    />
                </div>
            </div>
        </div>
    );

};

export default HomePage;


