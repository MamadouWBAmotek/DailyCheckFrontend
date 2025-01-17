import React, { useState, useEffect, useRef } from 'react';
import { ToDo } from '../Models/ToDo';
import { Status } from '../Models/Status';
import styles from '../Styles/Home.module.css';
import { useAuth } from '../Components/Auth';
import { ToDoViewModel } from '../Models/ToDoViewModel';
import { useFetchTodosByStatus } from '../Hooks/useFetchTodos';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TodoDetailsModal from '../Components/TodoDetailsModal';
import CreateTodoModal from '../Components/CreateTodoModal';
import ToDoItem from '../Components/ToDoItem';
import { Role } from '../Models/Roles';
import { User } from '../Components/User';
import UserItem from '../Components/UserItem';
import UserDetailsModal from '../Components/MainUserDetails';
import CreateUserModal from '../Components/CreateUserModal';
import { UserUpdateViewModel } from '../Models/UpdateUserViewModel';
import MainUserDetailsModal from '../Components/UserDetails';
import useChangeStatus from '../Hooks/useChangeStatus';


const HomePage: React.FC = () => {

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

    const [isToDoModalOpen, setIsToDoModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
    const [isMainUserDetailsModalOpen, setIsMainUserDetailsModalOpen] = useState(false);

    const [selectedTodo, setSelectedTodo] = useState<ToDo | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isUserEditing, setIsUserEditing] = useState<boolean>(false);
    const [isPasswordEditing, setIsPasswordEditing] = useState<boolean>(false);

    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [role, setRole] = useState<Role>(Role.User);

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [deadline, setDeadline] = useState<string>('');

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); 
    const { user, setIsauth, setUser } = useAuth();
    const [triggerUpdate, setTriggerUpdate] = useState(false);
    const [isAdminUser, setIsAdminUser] = useState(false);
    const [showUsersTodosOnly, setShowUsersTodosOnly] = useState(false);
    const [isMainUser, setIsMainUser] = useState<boolean>(false);

    const [userId] = useState(String(user?.id));
    const [userStatus] = useState(user?.role);
    const [toFetchStatus, setToFetchStatus] = useState<Status | undefined>(undefined);
    const { usersTodos, Fetchingrror, users } = useFetchTodosByStatus({ userId, toFetchStatus, triggerUpdate, isLoading, setIsLoading });
    const {
        success: changeTodosStatusSucces,
        error: changeTodosStatusError,
        isLoading: changeTodosStatusIsLoading,
        triggerUpdate: changeTodosStatusTriggerUpdate,
        handleChangeStatus,
    } = useChangeStatus();
    const [showUsers, setShowUsers] = useState(false);
    useEffect(() => {
        setTriggerUpdate(changeTodosStatusTriggerUpdate)
    }, [changeTodosStatusTriggerUpdate]);


    const handleStatusChange = (selectedStatus: Status | undefined) => {
        if (selectedStatus == undefined) {
            setShowUsers(false)
        }

        else if (selectedStatus == Status.Users) {
            setShowUsers(true)
            setShowUsersTodosOnly(false)
        }
        else {
            setShowUsers(false)

        }
        setToFetchStatus(selectedStatus);
    };
    const closeModal = () => {
        setTriggerUpdate(true);
        setIsMainUserDetailsModalOpen(false);
        setIsUserDetailsModalOpen(false);
        setError('');
        setIsPasswordEditing(false);
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

    const handleCreateTodo = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const formattedDeadline = new Date(deadline);
        const model: ToDoViewModel = {
            Title: title,
            Description: description,
            UserEmail: user?.email.toString() || '',
            UserId: user?.id.toString() || '',
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
                if (triggerUpdate == true) {
                    setTriggerUpdate(false)
                } else {
                    setTriggerUpdate(true)
                }
                closeModal();
                setSuccess(`To-Do "${data.todo.title}" created successfully!`);
                setTimeout(() => {
                    setSuccess(null)
                }, 1500);
            }

            else if (response.status == 400) {
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
            setIsLoading(false)
        }
    };
    const ShowTodoDetails = (todo: ToDo) => {
        setSelectedTodo(todo);
        setIsToDoModalOpen(true);
    };

    const handleUpdateTodo = async (e: React.FormEvent, todo: ToDo) => {
        e.preventDefault();
        const formattedDeadline = new Date(todo.deadline).toISOString();
        todo.deadline = formattedDeadline;
        try {
            const response = await fetch('http://localhost:5144/api/todo/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo),
            });

            if (response.ok) {
                if (triggerUpdate == true) {
                    setTriggerUpdate(false)
                } else {
                    setTriggerUpdate(true)
                }
                setIsToDoModalOpen(false);
                setSuccess(`To-Do "${todo.title}" updated successfully!`);
                setTimeout(() => {
                    setSuccess(null)
                }, 1500);
            } else {
                setIsToDoModalOpen(false);
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update To-Do');
                setTimeout(() => {
                    setError('')
                    setTriggerUpdate(true)
                }, 1500);
                setTriggerUpdate(false)
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(`Error: ${error.message}`);
            } else {
                setError('Unknown error occurred.');
            }
        }
    };
    const handleDeleteTodo = async (todo: ToDo) => {

        const confirmChange = window.confirm('Are you sure you want to delete this To-Do?');
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
                if (triggerUpdate == true) {
                    setTriggerUpdate(false)
                } else {
                    setTriggerUpdate(true)
                }
                setSuccess(`To-Do "${todo.title}" deleted successfully!`);
                setTimeout(() => {
                    setSuccess(null)
                }, 1500);
                setTriggerUpdate(false)
            }

        } catch (error) {
            setError('Error deleting todo!');
        } finally {
            setIsLoading(false);
        }
    };

    const ShowMainUserDetails = (user: User) => {
        setSelectedUser(user); 
        setIsUserDetailsModalOpen(true);
        setIsEditing(true) 
    };
    const ShowUserDetails = (user: User) => {
        setSelectedUser(user); 
        setIsMainUserDetailsModalOpen(true);
        setIsEditing(true) 
    };

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
                setSuccess(`User "${user.userName}" updated successfully!`);
                closeModal();
                setTimeout(() => {
                    setSuccess('');
                }, 2000);
            } else {
                setError(data.message);
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
                setUser(data.user)
                setSuccess(`User "${user.userName}" updated successfully!`);
                closeModal();
                setTimeout(() => {
                    setSuccess('');
                }, 2000);
            } else {
                setError(data.message);
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
            const requestBody = { userId: user.id.toString() };
            const response = await fetch('http://localhost:5144/api/login/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody), 
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


    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {

        if (e.target === e.currentTarget) {
            setIsUserDetailsModalOpen(false);
            setIsMainUserDetailsModalOpen(false)
            setIsUserEditing(false);
            // setIsEditing(false)
            setIsPasswordEditing(false);
            setIsMainUser(false);
            if (isCreateModalOpen == true) {
                closeModal();
            }
            else if (isCreateUserModalOpen == true) {
                closeModal();
            }
            else if (isToDoModalOpen == true) {
                closeModal();

            }
            else if (isUserModalOpen == true) {
                closeModal();
            }
            else {
                closeModal();
            }
        }
    };

    return (
        <div className={styles.homepage}>
            <div className={styles.header}>
                <h1>Daily Check</h1>
                <button onClick={() => { setIsMainUser(true); user ? ShowMainUserDetails(user) : '' }}><FontAwesomeIcon icon={faUser}></FontAwesomeIcon></button>
                <div className={styles['main-content-header']}>
                    {!showUsers ?
                        <h1>
                            {toFetchStatus != undefined && toFetchStatus != Status.Users ? Status[toFetchStatus] : "Upcoming"} {toFetchStatus == Status.All ? "To-Dos" : "To-Do(s)"} </h1>
                        : <h1>Users</h1>}
                    {isLoading && <p>Loading...</p>}
                    {Fetchingrror && <p style={{ color: 'red' }}>{Fetchingrror}</p>}
                    {error || changeTodosStatusError && <div className={styles.error}>{error} {changeTodosStatusError}</div>}
                    {success || changeTodosStatusSucces && <div className={styles.success}>{success}{changeTodosStatusSucces}</div>}
                    {!showUsers ? <button className={styles['main-content-createButton']} onClick={() => { setIsCreateModalOpen(true); setTriggerUpdate(false) }}>Create To-Do</button>
                        : <button type='button' className={styles['main-content-createButton']} onClick={() => { setIsCreateUserModalOpen(true); setTriggerUpdate(false) }}>Create User</button>}

                </div>

            </div>

            <div className={styles['main-container']}>
                <div className={styles.sidebar}>

                    <ul>
                        <h1 >ToDos</h1>

                        <li onClick={() => handleStatusChange(Status.Upcoming)}>Upcoming</li>
                        <li onClick={() => handleStatusChange(Status.Done)}>Done</li>
                        <li onClick={() => handleStatusChange(Status.Cancelled)}>Cancelled</li>
                        <li onClick={() => handleStatusChange(Status.Expired)} >Expired</li>
                        <li onClick={() => handleStatusChange(Status.All)} >All</li>

                        {user?.role === Role.Admin ?
                            <div>     <h1>Users</h1>

                                <li
                                    onClick={() => { handleStatusChange(Status.Users); setShowUsers(true) }}>
                                    Get Users
                                </li></div> : ''


                        }
                    </ul>
                </div>
                <div className={styles['main-content']}>

                    <div>
                        {
                            showUsers ?
                                <ul className={styles['todo-list']}>
                                    {users.length > 0 ? (
                                        users.map(user => (
                                            <UserItem key={user.id}
                                                user={user}
                                                ShowUserDetails={ShowUserDetails} isEditing={isUserEditing}
                                                setIsEditing={setIsUserEditing} handleDeleteUser={handleDeleteUser}
                                                setIsLoading={setIsLoading} />
                                        )
                                        )
                                    ) : (
                                        <p>No Users found.</p>
                                    )}
                                </ul>
                                :
                                <ul className={styles['todo-list']}>
                                    {usersTodos.length > 0 ? (
                                        usersTodos.map(todo => (
                                            <ToDoItem userId={user?.id.toString() || ''}
                                                key={todo.id} todo={todo} isAdminUser={isAdminUser}
                                                showMyToDos={showUsersTodosOnly} ShowTodoDetails={ShowTodoDetails}
                                                isEditing={isEditing} setIsEditing={setIsEditing} handleDeleteTodo={handleDeleteTodo}
                                                handleChangeStatus={handleChangeStatus} />
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
                            setSelectedTodo={setSelectedTodo}
                            handleOverlayClick={handleOverlayClick} />

                        <UserDetailsModal
                            isMainUser={isMainUser}
                            setIsMainUser={setIsMainUser}
                            error={error}
                            setError={setError}
                            isOpen={isUserDetailsModalOpen}
                            closeModal={closeModal}
                            selectedUser={selectedUser} isEditing={isUserEditing}
                            setIsEditing={setIsUserEditing}
                            handleUpdateUser={handleUpdateUser}
                            handleDeleteUser={handleDeleteUser}
                            setSelectedUser={setSelectedUser}
                            handleOverlayClick={handleOverlayClick}
                            handleUpdateMainUser={handleUpdateMainUser}
                            isPasswordEditing={isPasswordEditing}
                            setIsPasswordEditing={setIsPasswordEditing}
                            isLoading={isLoading} setIsLoading={setIsLoading} />

                        <MainUserDetailsModal isOpen={isMainUserDetailsModalOpen} error={error} setError={setError}
                            closeModal={closeModal} selectedUser={selectedUser} isEditing={isUserEditing}
                            setIsEditing={setIsUserEditing} handleUpdateUser={handleUpdateUser}
                            handleDeleteUser={handleDeleteUser}
                            setSelectedUser={setSelectedUser} handleOverlayClick={handleOverlayClick} />
                    </div>




                </div>


            </div>
        </div>
    );

};

export default HomePage;