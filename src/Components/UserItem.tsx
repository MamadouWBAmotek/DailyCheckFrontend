// components/ToDoItem.tsx
import React from 'react';
import styles from '../Styles/TodoItem.module.css';
import { User } from './User';
import { Role } from '../Models/Roles';

interface UserItemProps {
    user: User;
    onClick: () => void;
}

const UserItem: React.FC<UserItemProps> = ({ user, onClick, }) => {
    return (
        <li>
            <button className={styles['todo-item']} onClick={onClick}>

                <div className={styles['todoitem-content']}>

                    <div>
                        <h1 >{user.userName}</h1>
                        <h1> Status: {Role[user.role]}</h1>
                    </div>
                    <h1>{user.email}</h1>
                </div>
            </button>
        </li>
    );
};

export default UserItem;
