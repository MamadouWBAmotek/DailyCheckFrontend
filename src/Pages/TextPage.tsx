import React, { useState } from 'react';
import { ToDo } from '../Models/ToDo';
import { Status } from '../Models/Status';
import { useFetchTodosByStatus } from '../Hooks/useFetchTodos';
import { useAuth } from '../Components/Auth';

const TestHomePage: React.FC = () => {
    const { user } = useAuth();
    const [userId] = useState(String(user?.id)); // Remplacez 'user123' par l'ID utilisateur approprié
    const [toFetchStatus, setStatus] = useState<Status | undefined>(undefined);

    // Utilisation du hook pour récupérer les To-Dos
    const { todos, Fetchingrror } = useFetchTodosByStatus({ userId, toFetchStatus });

    // Fonction pour gérer le changement de statut
    const handleStatusChange = (selectedStatus: Status | undefined) => {
        setStatus(selectedStatus);
        console.log(toFetchStatus)

    };

    return (
        <div>
            <h1>Liste des To-Dos</h1>

            {/* Section de filtrage par statut avec des boutons */}
            <div>
                <span>Filtrer par statut: </span>
                <button onClick={() => handleStatusChange(undefined)} style={{ margin: '0 5px' }}>
                    Tous
                </button>
                <button onClick={() => handleStatusChange(Status.Upcoming)} style={{ margin: '0 5px' }}>
                    À venir
                </button>
                <button onClick={() => handleStatusChange(Status.Done)} style={{ margin: '0 5px' }}>
                    Terminé
                </button>
                <button onClick={() => handleStatusChange(Status.Cancelled)} style={{ margin: '0 5px' }}>
                    Annulé
                </button>
            </div>

            {/* Affichage des erreurs */}
            {Fetchingrror && <p style={{ color: 'red' }}>{Fetchingrror}</p>}

            {/* Liste des To-Dos */}
            <ul>
                {todos.map((todo: ToDo) => (
                    <li key={todo.id}>
                        <h2>{todo.title}</h2>
                        <p>{todo.description}</p>
                        <p>Status: {Status[todo.status]}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TestHomePage;
