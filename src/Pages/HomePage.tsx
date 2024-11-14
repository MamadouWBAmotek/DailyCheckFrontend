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
// import UserModal from '../Components/UserModal';
import ToDoItem from '../Components/ToDoItem';
import { Role } from '../Models/Roles';
import { User } from '../Components/User';
import UserItem from '../Components/UserItem';
import UserDetailsModal from '../Components/UserDetails';
import CreateUserModal from '../Components/CreateUserModal';
import { registerUser } from '../Utils/RegisterUser';
import e from 'express';
import { UserUpdateViewModel } from '../Models/UpdateUserViewModel';


const HomePage: React.FC = () => {

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

    const [isToDoModalOpen, setIsToDoModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);

    const [selectedTodo, setSelectedTodo] = useState<ToDo | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isUserEditing, setIsUserEditing] = useState<boolean>(false);

    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [role, setRole] = useState<Role>(Role.User);

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
    const [isAdminUser, setIsAdminUser] = useState(false);
    const [showUsersTodosOnly, setShowUsersTodosOnly] = useState(false);
    const [showUsersOnly, setShowUsersOnly] = useState(false);
    const [isMainUser, setIsMainUser] = useState<boolean>(false);

    const [userId] = useState(String(user?.id));
    const [userStatus] = useState(user?.role);
    const [toFetchStatus, setToFetchStatus] = useState<Status | undefined>(undefined);
    const { usersTodos, Fetchingrror, allTodos, users } = useFetchTodosByStatus({ userId, toFetchStatus, triggerUpdate, userStatus });
    const [todosUserId, setTodosUserId] = useState<string>('');
    // const [users, setUsers] = useState<User[]>([]);
    const [showUsers, setShowUsers] = useState(false);
    useEffect(() => {
        if (user?.role == 0) setIsAdminUser(true)
    }, [user]);


    const handleStatusChange = (selectedStatus: Status | undefined) => {
        if (selectedStatus == undefined) {
            setShowUsersTodosOnly(false)
            setShowUsers(false)
            setShowUsersOnly(false)
        }

        else if (selectedStatus == Status.Users) {
            setShowUsers(true)
            setShowUsersTodosOnly(false)
            setShowUsersOnly(true)

        }
        else {
            setShowUsers(false)
            setShowUsersOnly(false)

        }
        setToFetchStatus(selectedStatus);
        console.log(status)
    };
    // Close the modal
    const closeModal = () => {
        setTriggerUpdate(true);
        setIsEditing(false);
        setIsUserEditing(false);
        if (isCreateModalOpen == true) {
            setTitle('');
            setDescription('');
            setDeadline('');
            setError(null);
            setIsCreateModalOpen(false);
        }
        else if (isCreateUserModalOpen == true) {
            setUserName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError(null);
            setIsCreateUserModalOpen(false);
        }
        else if (isUserDetailsModalOpen == true) {
            setIsUserDetailsModalOpen(false);
            setError(null);
        }
        else if (isToDoModalOpen == true) {
            setIsToDoModalOpen(false);
            setError(null);
        }
    };

    // Handling the creation of a new To-Do
    const handleCreateTodo = async (e: React.FormEvent): Promise<void> => {
        if (!title || !description || !deadline) {
            setError('Please fill in all fields');
        }
        console.log("this is in the methode");

        const formattedDeadline = new Date(deadline).toISOString();
        const model: ToDoViewModel = {
            Title: title,
            Description: description,
            UserEmail: user?.email.toString() || '', // Use user ID from context
            UserId: user?.id.toString() || '', // Use user ID from context
            Deadline: formattedDeadline,
        };
        console.log("this is the model", model);

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
        finally {

        }
    };

    const ShowTodoDetails = (todo: ToDo) => {
        setSelectedTodo(todo); // Set the selected To-Do
        setIsEditing(false);
        setIsToDoModalOpen(true); // Open the modal
        // setTodosUserId(todo.userId)
    };
    const ShowUserDetails = (user: User) => {
        setSelectedUser(user); // Set the selected To-Do
        setIsEditing(false);
        setIsUserDetailsModalOpen(true); // Open the modal
        // setTodosUserId(todo.userId)
    };
    // const getUserbyTodosUserId = async (todosUserId: string) => {
    //     console.log("its been called");

    //     setIsLoading(true); // Active l'indicateur de chargement.
    //     try {
    //         const response = await fetch('http://localhost:5144/api/login/users/user', {
    //             method: 'GET',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ id: todosUserId.toString() })
    //         });
    //         const data = await response.json();
    //         console.log(data);
    //         if (response.ok) {
    //             // L'utilisateur ou l'utilisateur Google a été trouvé
    //             console.log('User found:', data);
    //             setTodosUserId(data.userName)
    //             console.log(data.userName) // Remplacez ceci par l'action que vous souhaitez effectuer avec les données utilisateur.
    //         } else {
    //             // Gère le cas où l'utilisateur n'est pas trouvé
    //             setError(data.message || 'User not found.');
    //         }
    //     } catch (error) {
    //         setError('Error fetching user information!'); // Gère les erreurs lors de la requête.
    //     } finally {
    //         setIsLoading(false); // Arrête l'indicateur de chargement.
    //     }
    // };

    // const getUsers = async () => {
    //     setShowUsers(true);
    //     try {
    //         const response = await fetch(`http://localhost:5144/api/login/users`, {
    //             method: 'GET',
    //             headers: { 'Content-Type': 'application/json' },
    //         });

    //         const data = await response.json();

    //         if (response.ok) {
    //             // L'utilisateur ou l'utilisateur Google a été trouvé
    //             console.log('User found:', data);
    //             const allUsers = [data.users + data.googleUsers]
    //             console.log(allUsers);
    //             setUsers([...data.users, ...data.googleUsers]);
    //             console.log("these are all the users", users) // Remplacez ceci par l'action que vous souhaitez effectuer avec les données utilisateur.
    //         } else {
    //             // Gère le cas où l'utilisateur n'est pas trouvé
    //             setError(data.message || 'User not found.');
    //         }
    //     } catch (error) {
    //         setError('Error fetching user information!'); // Gère les erreurs lors de la requête.
    //     } finally {
    //         setIsLoading(false); // Arrête l'indicateur de chargement.
    //     }
    // }

    const handleUpdateUser = async (user: User) => {
        setTriggerUpdate(false);
        try {
            const response = await fetch('http://localhost:5144/api/login/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            if (response.ok) {
                if (userId == user.id.toString()) {
                    setUser(user);
                }
                console.log(data.message);
                setSuccess(`User "${user.userName}" updated successfully!`);
                closeModal();
                setTimeout(() => {
                    setSuccess('');
                }, 2000);
            } else {
                setError(data.message);
                console.log(error);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(`Error: ${error.message}`);
            } else {
                setError('Unknown error occurred.');
            }
        }
    }
    const handleUpdateMainUser = async (user: UserUpdateViewModel) => {

        setTriggerUpdate(false);
        try {
            const response = await fetch('http://localhost:5144/api/login/mainuser/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            if (response.ok) {
                console.log("this is user", data.user);
                setUser(data.user)
                console.log(data.message);
                setSuccess(`User "${user.userName}" updated successfully!`);
                closeModal();
                setTimeout(() => {
                    setSuccess('');
                }, 2000);
            } else {
                setError(data.message);
                console.log(error);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(`Error: ${error.message}`);
            } else {
                setError('Unknown error occurred.');
            }
        }
    }
    const handleDeleteUser = async (user: User) => {
        setTriggerUpdate(false);
        const confirmChange = window.confirm('Are you sure you want to DELETE this user?');
        if (!confirmChange) return;

        setIsLoading(true);

        try {
            // Vérification du corps de la requête
            const requestBody = { userId: user.id.toString() };
            console.log("Request body:", requestBody);

            const response = await fetch('http://localhost:5144/api/login/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody), // Assurez-vous que le format est correct
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(`User "${user.userName}" deleted successfully!`);
                closeModal();
                setTimeout(() => {
                    setSuccess('');
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error deleting user!');
            }
        } catch (error) {
            console.error(error);
            setError('Error deleting user!');
        } finally {
            setIsLoading(false);
        }
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
                setIsToDoModalOpen(false);
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
                setIsToDoModalOpen(false);
                // Ferme le modal si l'opération réussit.
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
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {

        if (e.target === e.currentTarget) {
            if (isCreateModalOpen == true) {
                closeModal();
            }
            else if (isCreateUserModalOpen == true) {
                closeModal();

                // setIsCreateUserModalOpen(false);

            }
            else if (isToDoModalOpen == true) {
                closeModal();

                // setIsToDoModalOpen(false);
            }
            else if (isUserModalOpen == true) {
                closeModal();

                // setIsUserModalOpen(false)
            }
            else {
                closeModal();

                // setIsUserDetailsModalOpen(false);

            }
        }
    };
    const handleUpdateTodo = async (todo: ToDo) => {

        const formattedDeadline = new Date(todo.deadline).toISOString()
        todo.deadline = formattedDeadline;
        try {
            const response = await fetch('http://localhost:5144/api/todo/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo),
            });

            if (response.ok) {
                setSuccess(`To-Do "${todo.title}" updated successfully!`);
                setIsToDoModalOpen(false);
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
                <h1>Daily Check</h1>
                <button onClick={() => { setIsMainUser(true); user ? ShowUserDetails(user) : '' }}><FontAwesomeIcon icon={faUser}></FontAwesomeIcon></button>
                <div className={styles['main-content-header']}>
                    {!showUsers ?
                        <h1>{showUsersTodosOnly ? <span> My </span> : <span> All </span>}  {toFetchStatus != undefined && toFetchStatus != Status.Users ? Status[toFetchStatus] : ""} To-Dos</h1>
                        : <h1>Users</h1>}
                    {isLoading && <p>Loading...</p>}
                    {Fetchingrror && <p style={{ color: 'red' }}>{Fetchingrror}</p>}
                    {success && <div className={styles.success}>{success}</div>}
                    {!showUsers ? <button className={styles['main-content-createButton']} onClick={() => { setIsCreateModalOpen(true); setTriggerUpdate(false) }}>Create To-Do</button>
                        : <button type='button' className={styles['main-content-createButton']} onClick={() => { setIsCreateUserModalOpen(true); setTriggerUpdate(false) }}>Create User</button>}


                </div>
            </div>

            <div className={styles['main-container']}>
                <div className={styles.sidebar}>

                    <ul>
                        <li onClick={() => handleStatusChange(undefined)} >All ToDos</li>
                        {user?.role === Role.Admin && (
                            <li>
                                <label className="switch">
                                    <span className="slider"></span>
                                    <span className="slider-label">Show my todos only</span>
                                    <input
                                        type="checkbox"
                                        className={styles['switch']}
                                        checked={showUsersTodosOnly}
                                        onChange={() => { setShowUsersTodosOnly((prev) => !prev); setShowUsers(false); }}
                                    // disabled={showUsers}
                                    />

                                </label>
                            </li>


                        )}
                        <li onClick={() => handleStatusChange(Status.Upcoming)}>Upcoming</li>
                        <li onClick={() => handleStatusChange(Status.Done)}>Done ToDos</li>
                        <li onClick={() => handleStatusChange(Status.Cancelled)}>Cancelled ToDos</li>
                        {user?.role === Role.Admin && (
                            <li
                                onClick={() => handleStatusChange(Status.Users)}
                            // aria-disabled={showUsersTodosOnly}
                            >Get Users
                            </li>


                        )}
                    </ul>
                </div>
                <div className={styles['main-content']}>

                    <div>
                        {isAdminUser && !showUsersTodosOnly ?

                            showUsers ?
                                <ul className={styles['todo-list']}>
                                    {users.length > 0 ? (
                                        users.map(user => (
                                            <UserItem key={user.id} user={user} onClick={() => { setIsMainUser(false); ShowUserDetails(user) }} />
                                        )
                                        )
                                    ) : (
                                        <p>No Users found.</p>
                                    )}
                                </ul>
                                :
                                <ul className={styles['todo-list']}>
                                    {allTodos.length > 0 ? (
                                        allTodos.map(todo => (
                                            <ToDoItem userId={user?.id.toString() || ''} key={todo.id} todo={todo} isAdminUser={isAdminUser} showMyToDos={showUsersTodosOnly} onClick={() => ShowTodoDetails(todo)} />
                                        ))
                                    ) : (
                                        ""
                                    )}
                                </ul> :
                            <ul className={styles['todo-list']}>
                                {usersTodos.length > 0 ? (
                                    usersTodos.map(todo => (
                                        <ToDoItem userId={user?.id.toString() || ''} key={todo.id} todo={todo} isAdminUser={isAdminUser} showMyToDos={showUsersTodosOnly} onClick={() => ShowTodoDetails(todo)} />
                                    ))
                                ) : (
                                    ""
                                )}
                            </ul>}

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
                            handleOverlayClick={handleOverlayClick}
                        />
                        <CreateUserModal
                            isOpen={isCreateUserModalOpen}
                            closeModal={closeModal}
                            userName={userName}
                            setUserName={setUserName}
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            error={error}
                            setError={setError}
                            role={role}
                            setRole={setRole}
                            handleOverlayClick={handleOverlayClick}
                            triggerUpdate={triggerUpdate} setTriggerUpdate={setTriggerUpdate}
                            succes={success} setSucces={setSuccess} />

                        <TodoDetailsModal
                            isOpen={isToDoModalOpen}
                            closeModal={() => { setIsToDoModalOpen(false); }}
                            selectedTodo={selectedTodo}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            handleUpdateTodo={handleUpdateTodo}
                            handleDeleteTodo={handleDeleteTodo}
                            handleChangeStatus={handleChangeStatus}
                            setSelectedTodo={setSelectedTodo} // Ajoutez cette ligne
                            handleOverlayClick={handleOverlayClick} />
                        {/* <UserModal
                            isOpen={isUserModalOpen}
                            closeModal={() => { setIsUserModalOpen(false); }}
                            userName={user?.userName}
                            handleOverlayClick={handleOverlayClick}
                        /> */}
                        <UserDetailsModal
                            isMainUser={isMainUser}
                            setIsMainUser={setIsMainUser}
                            error={error}
                            setError={setError}
                            isOpen={isUserDetailsModalOpen}
                            closeModal={() => { setIsUserDetailsModalOpen(false); setIsUserEditing(false); }}
                            selectedUser={selectedUser} isEditing={isUserEditing}
                            setIsEditing={setIsUserEditing}
                            handleUpdateUser={handleUpdateUser}
                            handleDeleteUser={handleDeleteUser}
                            setSelectedUser={setSelectedUser}
                            handleOverlayClick={handleOverlayClick}
                            handleUpdateMainUser={handleUpdateMainUser} />
                    </div>




                </div>


            </div>
        </div>
    );

};

export default HomePage;


