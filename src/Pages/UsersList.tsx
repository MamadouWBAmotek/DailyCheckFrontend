import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

// Créez une instance de QueryClient
const queryClient = new QueryClient();

// Fonction pour récupérer les utilisateurs
const fetchUsers = async () => {
    const response = await fetch('http://localhost:5144/api/users');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

// Composant qui affiche la liste des utilisateurs
const UsersList: React.FC = () => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['users'],  // clé de la requête
        queryFn: fetchUsers,   // fonction de requête
    });

    if (isLoading) return <div>Loading...</div>;
    if (error instanceof Error) return <div>An error occurred: {error.message}</div>;

    return (
        <ul>
            {data?.map((user: { id: number; username: string }) => (
                <li style={{ backgroundColor: "red", color: "black" }} key={user.id}>
                    username: {user.username} <br /> id: {user.id}
                </li>
            ))}
        </ul>
    );
};

// Composant principal enveloppé par QueryClientProvider
const App: React.FC = () => {
    return (
        // Fournir QueryClient à l'application
        <QueryClientProvider client={queryClient}>
            <UsersList />
        </QueryClientProvider>
    );
};

export default App;
