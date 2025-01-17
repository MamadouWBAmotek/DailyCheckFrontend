import { useState, useEffect } from 'react';
import { ToDo } from '../Models/ToDo';
import { Status } from '../Models/Status';
import { User } from '../Components/User';
import useChangeStatus from './useChangeStatus';



type FetchTodosByStatusOptions = {
    userId: string;
    toFetchStatus?: Status;
    triggerUpdate?: boolean;
    isLoading?: boolean;
    setIsLoading: (isLoading: boolean) => void;
};

export const useFetchTodosByStatus = ({ userId, toFetchStatus, triggerUpdate, setIsLoading, isLoading }: FetchTodosByStatusOptions) => {
    const [usersTodos, setUsersTodos] = useState<ToDo[]>([]);
    const [usersTotalTodos, setUsersTotalTodos] = useState<number>();
    const [users, setUsers] = useState<User[]>([]);
    const [Fetchingrror, setFetchingrror] = useState<string | null>(null);
    const {
        success: changeTodosStatusSucces,
        error: changeTodosStatusError,
        isLoading: changeTodosStatusIsLoading,
        handleChangeStatus,
    } = useChangeStatus();
    useEffect(() => {
        const fetchTodos = async () => {
            setFetchingrror('');
            setIsLoading(true);
            if (toFetchStatus == Status.Users) {
                try {
                    const response = await fetch(`http://localhost:5144/api/login/users`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const data = await response.json();
                    if (!response.ok) {
                        setFetchingrror(data.message || 'Failed to fetch To-Dos');
                        setUsers([]);
                    }
                    else if (response.ok) {
                        setUsers([...data.users, ...data.googleUsers])
                    }
                } catch (error) {
                    setFetchingrror('Error fetching user information!');
                } finally {
                    setIsLoading(false);
                }
            }
            else {
                try {
                    var endpoint = 'http://localhost:5144/api/todo/todos';

                    const requestBody = {
                        UserId: userId,
                        Status: toFetchStatus !== undefined ? toFetchStatus : undefined,
                    };


                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestBody),
                    });

                    const data = await response.json();

                    if (!response.ok) {

                        setUsersTodos([]);
                        setFetchingrror(data.message || 'Failed to fetch To-Dos');
                    }
                    else if (response.ok && data.usersTodos.length > 0) {
                        setUsersTodos(data.usersTodos);
                        if (toFetchStatus == undefined || toFetchStatus == Status.Upcoming) {
                            usersTodos.forEach(todo => {
                                if (new Date(todo.deadline) < new Date(Date.now())) {
                                    todo.status == Status.Expired
                                    handleChangeStatus(todo, Status.Expired)
                                }
                            });
                            triggerUpdate = true;
                            setFetchingrror(null);
                            setUsersTotalTodos(data.usersTotalTodos)
                            setTimeout(() => {
                                triggerUpdate = false;
                            }, 1000);
                        }

                    }

                    else {

                        setUsersTodos([]);
                        setFetchingrror(`No ${requestBody.Status == undefined ? "Upcoming" : Status[requestBody.Status]} To-Dos found.`);
                        setUsersTotalTodos(data.usersTotalTodos)
                    }
                } catch (err) {
                    setFetchingrror((err as Error).message);
                } finally {

                    setIsLoading(false);
                }
            }
        };

        if (userId) {
            fetchTodos();
        }
    }, [toFetchStatus, triggerUpdate]);

    return { usersTodos, Fetchingrror, users, isLoading, usersTotalTodos };
};  