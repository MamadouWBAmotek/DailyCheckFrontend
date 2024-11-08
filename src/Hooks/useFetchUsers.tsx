import { useState, useEffect } from 'react';
import { Status } from '../Models/Status';
import { Role } from '../Models/Roles';
import { User } from '../Components/User';

type FetchTodosByStatusOptions = {
    triggerUpdate?: boolean; // Status optionnel pour filtrer par statut
    userId: string
};

export const useFetchUsers = ({ triggerUpdate, userId }: FetchTodosByStatusOptions) => {

    const [users, setUsers] = useState<User[]>([]);
    const [Fetchingrror, setFetchingrror] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Adding a loading indicator

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            console.log("Fetching Users for user:", userId);
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:5144/api/login/users`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const data = await response.json();

                if (response.ok) {
                    // L'utilisateur ou l'utilisateur Google a été trouvé
                    console.log('User found:', data);
                    const allUsers = [data.users + data.googleUsers]
                    console.log(allUsers);
                    setUsers([...data.users, ...data.googleUsers]);
                    console.log("these are all the users", users) // Remplacez ceci par l'action que vous souhaitez effectuer avec les données utilisateur.
                } else {
                    // Gère le cas où l'utilisateur n'est pas trouvé
                    setFetchingrror(data.message || 'User not found.');
                }
            } catch (error) {
                setFetchingrror('Error fetching user information!'); // Gère les erreurs lors de la requête.
            } finally {
                setIsLoading(false); // Arrête l'indicateur de chargement.
            }
        };

        if (userId) {
            fetchUsers();
        }
    }, [userId, triggerUpdate, users]); // Assurez-vous que toFetchStatus est dans le tableau des dépendances

    return { Fetchingrror, users };
};  