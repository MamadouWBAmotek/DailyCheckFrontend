// components/ToDoItem.tsx
import React from 'react';
import styles from '../Styles/TodoItem.module.css';
import { User } from './User';
import { Role } from '../Models/Roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

interface UserItemProps {
    user: User;
    ShowUserDetails: (user: User) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    handleDeleteUser: (user: User) => Promise<void>;

}

const UserItem: React.FC<UserItemProps> = ({ user, ShowUserDetails, isEditing, setIsEditing, handleDeleteUser }) => {
    return (
        <li className={styles['todo-itemli']}>
            <button className={styles['todo-item']} onClick={() => ShowUserDetails(user)}>
                {/* <div className={styles['todo-title']}>

                </div> */}
                <table className={styles['table']}>
                    <td style={{ width: '20%' }}>{user.userName}</td>
                    <td style={{ width: '30%' }}>{user.email}</td>
                    <td style={{ width: '30%' }}>{Role[user.role]}</td>
                </table>
            </button>
            <td style={{ width: '10%', textAlign: 'center' }}>

                <button className={styles['delete']} onClick={(e) => { e.preventDefault(); handleDeleteUser(user) }}>
                    <FontAwesomeIcon icon={faTrash} size='xl' />
                </button>
            </td>
            <td style={{ width: '10%', textAlign: 'center' }}>
                <button type='button' className={styles['edit']} onClick={() => { setIsEditing(true); ShowUserDetails(user); }}>
                    <FontAwesomeIcon icon={faPenToSquare} size='xl' />
                </button>
            </td>
            {/* <button className={styles['todo-item']} onClick={onClick}>

                <div className={styles['todoitem-content']}>

                    <div>
                        <h1 >{user.userName}</h1>
                        <h1> Status: {Role[user.role]}</h1>
                    </div>
                    <h1>{user.email}</h1>
                </div>
            </button> */}
        </li>
    );
};

export default UserItem;
