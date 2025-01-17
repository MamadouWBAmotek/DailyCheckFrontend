import { useState } from 'react';
import { ToDo } from '../Models/ToDo';
import { Status } from '../Models/Status';

const useChangeStatus = () => {
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [triggerUpdate, setTriggerUpdate] = useState<boolean>(false);


    const handleChangeStatus = async (todo: ToDo, newStatus: Status) => {
        if (newStatus != Status.Expired) {
            const confirmChange = window.confirm(`Are you sure you want to change the status of this To-Do to ${Status[newStatus]}?`);
            if (!confirmChange) return;
        }


        setIsLoading(true);

        const requestBody = {
            TodoId: todo.id,
            NewStatus: newStatus,
        };

        if (todo.status === newStatus) {
            setIsLoading(false);
            setError(`This To-Do already has the status ${Status[newStatus]}`);
            setTimeout(() => {
                setError('');
            }, 2000);
        } else {
            try {
                const response = await fetch('http://localhost:5144/api/todo/changestatus', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();

                if (response.ok) {
                    if (triggerUpdate == true) {
                        setTriggerUpdate(false)
                    } else {
                        setTriggerUpdate(true)
                    }
                    setSuccess(`To-Do's status successfully changed to ${Status[newStatus]}!`);
                    setTimeout(() => {
                        setSuccess('');
                    }, 1500);
                } else {
                    setError(data.message || 'Failed to change To-Do status');
                }
            } catch (error) {
                setError('Error changing To-Do status.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return {
        success,
        error,
        isLoading,
        handleChangeStatus,
        triggerUpdate
    };
};

export default useChangeStatus;
