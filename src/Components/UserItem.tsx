// components/ToDoItem.tsx
import React from 'react';
import styles from '../Styles/Item.module.css';
import { User } from './User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useFetchTodosByStatus } from '../Hooks/useFetchTodos';

interface UserItemProps {
    user: User;
    ShowUserDetails: (user: User) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    handleDeleteUser: (user: User) => Promise<void>;
    isLoading?: boolean;
    setIsLoading: (isLoading: boolean) => void;

}
const UserItem: React.FC<UserItemProps> = ({ user, ShowUserDetails, isEditing, isLoading, setIsLoading, setIsEditing, handleDeleteUser }) => {
    const { usersTotalTodos } = useFetchTodosByStatus({
        userId: String(user.id),
        toFetchStatus: undefined,
        setIsLoading: setIsLoading
    });
    console.log("this is de     amount  are de users todos", usersTotalTodos);
    return (
        <div className={styles['todo-itemli']}>
            <div style={{ width: '100%', display: 'flex', }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '10%', }}>
                    <button title='Edit Task' type='button' className={styles['edit']} onClick={() => { ShowUserDetails(user); setIsEditing(true); }}>
                        <FontAwesomeIcon icon={faPenToSquare} size='xl' />
                    </button>
                    {/* <button title='Cancel Task' className={styles['cancel']} onClick={() => handleChangeStatus(todo, Status.Cancelled)}><FontAwesomeIcon icon={faXmark} size='xl' color='orange' /></button> */}
                </div>

                <div onClick={() => ShowUserDetails(user)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '80%', textAlign: 'center' }}>
                    <h1><b> {user.userName.toLocaleUpperCase()}</b></h1>

                    <p>User has {usersTotalTodos} To-Do(s)</p>
                    {/* <p> <b style={{ textDecoration: 'underline' }}> Description</b>{': '}
                        {user.description.length >= 30 ? (<>
                            {todo.description.substring(0, 30)}...{''}
                        </>) : (todo.description)}</p>
                    <p> <b style={{ textDecoration: 'underline' }}> Deadline</b>{': '}  {todo.deadline.substring(0, 10)} at <strong style={{ color: changeBgColor ? 'orange' : '' }}>{todo.deadline.substring(11, 16)}</strong> </p> */}

                </div>


                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '10%', }}>
                    <button title='Delete Task' className={styles['delete']} onClick={(e) => { e.preventDefault(); handleDeleteUser(user); }}>
                        <FontAwesomeIcon icon={faTrash} size='xl' />
                    </button>
                    {/* <button title='Task Done' className={styles['done']} onClick={() => handleChangeStatus(todo, Status.Done)}><FontAwesomeIcon icon={faSquareCheck} size='xl' color='green' /></button> */}
                </div>
            </div>
        </div >
    );
};

export default UserItem;
