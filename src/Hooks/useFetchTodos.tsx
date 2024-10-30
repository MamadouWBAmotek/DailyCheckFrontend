import { useState, useEffect } from 'react';
import { ToDo } from '../Models/ToDo';
import { Status } from '../Models/Status';

type FetchTodosByStatusOptions = {
    userId: string;
    toFetchStatus?: Status;
    triggerUpdate?: boolean; // Status optionnel pour filtrer par statut
};

export const useFetchTodosByStatus = ({ userId, toFetchStatus,triggerUpdate }: FetchTodosByStatusOptions) => {
    const [todos, setTodos] = useState<ToDo[]>([]);
    const [Fetchingrror, setFetchingrror] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Adding a loading indicator

    useEffect(() => {
        const fetchTodos = async () => {
            setIsLoading(true);
            console.log("Fetching todos for user:", userId, "with status:", toFetchStatus);
            try {
                const endpoint = 'http://localhost:5144/api/todo/todos';

                const requestBody = {
                    UserId: String(userId),
                    Status: toFetchStatus !== undefined ? toFetchStatus : null,
                };

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json(); // Lire le corps de la réponse une seule fois

                if (!response.ok) {
                    setFetchingrror(data.message || 'Failed to fetch To-Dos');
                    setTodos([]); // Réinitialiser la liste des To-Dos en cas d'erreur
                } else if (data.todos) {
                    setTodos(data.todos);
                    setFetchingrror(null);

                } else {
                    setFetchingrror(`No ${requestBody.Status} To-Dos found.`);
                    setTodos([]); // Réinitialiser la liste des To-Dos si aucun n'est trouvé
                }
            } catch (err) {
                setFetchingrror((err as Error).message);
                setTodos([]); // Réinitialiser la liste des To-Dos en cas d'erreur
            } finally {
                setIsLoading(false); // Fin du chargement
            }

        };

        if (userId) {
            fetchTodos();
        }
    }, [userId, toFetchStatus,triggerUpdate]); // Assurez-vous que toFetchStatus est dans le tableau des dépendances

    return { todos, Fetchingrror };
};  