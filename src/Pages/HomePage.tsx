import React, { useState, useEffect, useRef } from 'react';
import { ToDo } from '../Models/ToDo';
import { Status } from '../Models/Status';
import styles from '../Styles/Home.module.css'; // Importation des styles CSS Modules
import { useAuth } from '../Components/Auth';
import { ToDoViewModel } from '../Models/ToDoViewModel';
import { METHODS } from 'http';
import { json } from 'stream/consumers';
import { User } from '../Components/User';
import Cookies from 'js-cookie';
import { useNavigate } from '@tanstack/react-router';


const HomePage: React.FC = () => {
    const [todos, setTodos] = useState<ToDo[]>([]);
    const [sortToDos, setSortToDos] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isToDoModalOpen, setIsToDoModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<ToDo | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [deadline, setDeadline] = useState<string>('');
    const [status, setStatus] = useState<Status>(Status.Upcoming);
    const [isUpcoming, setIsUpcoming] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Adding a loading indicator
    const { user, setIsauth } = useAuth();
    const [localUser, setLocalUser] = useState<User>();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchTodos();
        // Initial call to fetch To-Dos
    }, []);

    // Function to fetch To-Dos with a status filter
    const fetchTodos = async () => {
        setSortToDos('');
        setIsDone(false);
        setIsCancelled(false);
        setIsLoading(true); // Start loading

        try {
            const response = await fetch('http://localhost:5144/api/todo/todos/all-todos', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(String(user?.id))

            });
            const data = await response.json();
            if (response.status === 404 && data.message == "No To-Dos found.") {
                setError("No To-Dos found.");
                setTodos(data.todos);
                console.error(error);
                throw new Error("No To-Dos found.");
            }
            setTodos(data.todos);
            setError(null); // Reset errors
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    const handleLogout = async () => {
        setIsauth(false); // Update authentication state
        setUser(undefined); // Clear user state
        Cookies.remove('isauth'); // Remove authentication cookie
        Cookies.remove('user'); // Remove user cookie
        navigate({ to: '/login' }); // Redirect to the home page or login page
    };

    const fetchUpcomingTodos = async () => {
        setSortToDos("Upcoming");
        setIsLoading(true);
        setIsDone(false);
        setIsCancelled(false);
        setIsUpcoming(true);
        try {
            const response = await fetch('http://localhost:5144/api/todo/todos/upcoming', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(String(user?.id))

            });
            const data = await response.json();

            if (response.status === 404 && data.message == "No upcoming To-Dos found.") {
                setError("No upcoming To-Dos found.");
                setTodos(data.todos);
                console.error(error);
                throw new Error("No upcoming To-Dos found.");
            }
            setTodos(data.todos);

            setError(null); // Reset errors
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    const fetchDoneTodos = async () => {
        setSortToDos('Done');
        setIsLoading(true);
        setIsCancelled(false);
        setIsDone(true);
        try {
            const response = await fetch('http://localhost:5144/api/todo/todos/done', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(String(user?.id))

            });
            const data = await response.json();

            if (response.status === 404 && data.message == "No done To-Dos found.") {
                setError("No done To-Dos found.");
                setTodos(data.todos);
                console.error(error);
                throw new Error("No done To-Dos found.");
            }
            setTodos(data.todos);
            setError(null); // Reset errors
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); // End loading
        }


    };

    const fetchCancelledTodos = async () => {
        setSortToDos('Cancelled');
        setIsDone(false);
        setIsLoading(true);
        setIsCancelled(true);
        try {
            const response = await fetch('http://localhost:5144/api/todo/todos/cancelled', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(String(user?.id))

            });
            const data = await response.json();

            if (response.status === 404 && data.message == "No cancelled To-Dos found.") {
                setError("No cancelled To-Dos found.");
                throw new Error("No cancelled To-Dos found.");
                console.error(error);
            }
            setTodos(data.todos);

            setError(null); // Reset errors
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
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
                closeModal(); // Close the modal after creation
                setSuccess(`To-Do "${data.todo.title}" created successfully!`);
                setTimeout(() => {
                    setSuccess("");
                }, 2000);
                fetchTodos(); // Refresh the To-Dos list
            } else if (response.status == 400 && data.message == "The deadline cannot be in the past.") {
                console.log("the deadline is the past");
                setError("The deadline cannot be in the past.");
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
        setSelectedTodo(todo); // Set the selected To-Do
        setIsEditing(false);
        setIsToDoModalOpen(true); // Open the modal
    };


    const closeToDoModal = () => {
        setIsToDoModalOpen(false);
    };

    const handleDeleteTodo = async (todo: ToDo) => {
        try {
            const response = await fetch('http://localhost:5144/api/todo/todos/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo),
            });

            if (response.ok) {
                closeToDoModal();
                setSuccess(`To-Do "${todo.title}" deleted successfully!`);
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(`Error: ${error.message}`);
            } else {
                setError('Unknown error occurred while deleting the To-Do.');
            }
        }
    };


    const handleChangeStatusToCancelled = async (todoId: number) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this To-Do?');
        if (!confirmCancel) return;

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5144/api/todo/cancel', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todoId),
            });

            const data = await response.json();
            if (response.ok && data.message === "To-Do item already cancelled") {
                setError("To-Do item already cancelled");
                closeToDoModal();
            } else if (response.ok) {
                setSuccess("To-Do's status successfully changed to cancelled!");
                fetchCancelledTodos();
                closeToDoModal();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to cancel To-Do');
            }
        } catch (error) {
            setError('Error cancelling To-Do.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeStatusToDone = async (todoId: number) => {
        const confirmDone = window.confirm('Are you sure you want to mark this To-Do as done?');
        if (!confirmDone) return;

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5144/api/todo/done', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todoId),
            });

            const data = await response.json();
            if (response.ok && data.message === "To-Do item already done") {
                setError("To-Do item already done");
                closeToDoModal();
            } else if (response.ok) {
                setSuccess("To-Do's status successfully changed to done!");
                fetchDoneTodos();
                closeToDoModal();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to mark To-Do as done');
            }
        } catch (error) {
            setError('Error changing To-Do status to done.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateTodo = async (todo: ToDo) => {
        if (!todo) return;

        const formattedDeadline = new Date(todo.deadline).toISOString();
        const updatedModel: ToDo = {
            ...todo,
            userId: user?.id.toString() || '',
            deadline: formattedDeadline,
        };

        try {
            const response = await fetch('http://localhost:5144/api/todo/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedModel),
            });

            if (response.ok) {
                setSuccess(`To-Do "${updatedModel.title}" updated successfully!`);
                fetchTodos();
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
                <button onClick={() => setIsModalOpen(true)}>Create To-Do</button>
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
                    {isLoading && <p>Loading...</p>}
                    {error && <div className={styles.error}>{error}</div>}
                    {success && <div className={styles.success}>{success}</div>}

                    <h1>My {sortToDos} To-Dos</h1>
                    <ul className={styles['todo-list']}>
                        {todos.map((todo) => (
                            <li key={todo.id}>
                                <button className={styles['todo-item']} onClick={() => ShowTodoDetails(todo)}>
                                    <div className={styles['todoitem-content']}>
                                        <h1>{todo.title}</h1>
                                        <p>{new Date(todo.deadline).toLocaleString()}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>

                    {isToDoModalOpen && selectedTodo && (
                        <div className={styles.modal}>
                            <div className={styles['modal-content']}>
                                <span className={styles.close} onClick={closeToDoModal}>&times;</span>
                                <form>
                                    <h3>{isEditing ? 'Edit To-Do' : 'To-Do Details'}</h3>
                                    <input
                                        type="text"
                                        value={selectedTodo?.title || ''}
                                        onChange={(e) => setSelectedTodo({ ...selectedTodo, title: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                    <input
                                        type="text"
                                        value={selectedTodo.description}
                                        onChange={(e) => setSelectedTodo({ ...selectedTodo, description: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                    <input
                                        type="datetime-local"
                                        value={new Date(selectedTodo.deadline).toISOString().slice(0, 16)}
                                        onChange={(e) => setSelectedTodo({ ...selectedTodo, deadline: e.target.value })}
                                    />

                                    <div className={styles['button-container']}>
                                        {isEditing ? (
                                            <>
                                                <button onClick={() => handleUpdateTodo(selectedTodo)}>Save</button>
                                                <button onClick={() => setIsEditing(false)}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleDeleteTodo(selectedTodo)}>Delete</button>
                                                {!isCancelled && <button onClick={() => handleChangeStatusToCancelled(selectedTodo.id)}>Cancel</button>}
                                                <button onClick={() => setIsEditing(true)}>Edit</button>
                                                {!isDone && <button onClick={() => handleChangeStatusToDone(selectedTodo.id)}>Done</button>}
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isModalOpen && (
                        <div className={styles.modal}>
                            <div className={styles['modal-content']}>
                                <span className={styles.close} onClick={closeModal}>&times;</span>
                                <form onSubmit={handleCreateTodo}>
                                    <h3>Create To-Do</h3>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                                    <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
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
function setUser(undefined: undefined) {
    throw new Error('Function not implemented.');
}

