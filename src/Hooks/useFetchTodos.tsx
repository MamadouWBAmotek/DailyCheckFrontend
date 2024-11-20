import { useState, useEffect } from 'react';
import { ToDo } from '../Models/ToDo';
import { Status } from '../Models/Status';
import { Role } from '../Models/Roles';
import { User } from '../Components/User';

type FetchTodosByStatusOptions = {
    userId: string;
    toFetchStatus?: Status;
    userStatus?: Role;
    triggerUpdate?: boolean;
    isLoading?: boolean;
    setIsLoading: (isLoading: boolean) => void;
};

export const useFetchTodosByStatus = ({ userId, toFetchStatus, triggerUpdate, userStatus,setIsLoading,isLoading }: FetchTodosByStatusOptions) => {
    const [usersTodos, setUsersTodos] = useState<ToDo[]>([]);
    const [allTodos, setAllTodos] = useState<ToDo[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [Fetchingrror, setFetchingrror] = useState<string | null>(null);
    // const [isLoading, setIsLoading] = useState<boolean>(false); // Adding a loading indicator

    useEffect(() => {
        const fetchTodos = async () => {
            setFetchingrror('');
            setIsLoading(true);
            console.log("Fetching Users for user:", userId, "with status:", toFetchStatus, "user is:", userStatus);
            if (toFetchStatus == Status.Users) {
                try {
                    const response = await fetch(`http://localhost:5144/api/login/users`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        setFetchingrror(data.message || 'Failed to fetch To-Dos');
                    } else if (data.users || data.googleUsers) {
                        setUsers([...data.users, ...data.googleUsers]);
                    }
                } catch (error) {
                    setFetchingrror('Error fetching user information!'); // Gère les erreurs lors de la requête.
                } finally {
                    setIsLoading(false); // Arrête l'indicateur de chargement.
                }
            }
            else {
                try {
                    var endpoint = 'http://localhost:5144/api/todo/todos';

                    const requestBody = {
                        UserId: String(userId),
                        Status: toFetchStatus !== undefined ? toFetchStatus : null,
                        UserStatus: userStatus
                    };


                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestBody),
                    });

                    const data = await response.json(); // Lire le corps de la réponse une seule fois

                    if (!response.ok) {

                        setAllTodos([]);
                        setUsersTodos([]);
                        setFetchingrror(data.message || 'Failed to fetch To-Dos');
                    } else if (data.todos || data.usersTodos) {


                        setAllTodos(data.todos)
                        setUsersTodos(data.usersTodos);
                        setFetchingrror(null);

                    }

                    else {


                        setFetchingrror(`No ${requestBody.Status} To-Dos found.`);

                    }
                } catch (err) {
                    setFetchingrror((err as Error).message);
                } finally {

                    setIsLoading(false); // Fin du chargement
                }
            }


        };

        if (userId) {
            fetchTodos();
        }
    }, [toFetchStatus, triggerUpdate]); // Assurez-vous que toFetchStatus est dans le tableau des dépendances

    return { usersTodos, Fetchingrror, users, allTodos };
};  