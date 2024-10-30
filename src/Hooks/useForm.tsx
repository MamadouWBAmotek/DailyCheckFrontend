import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

const useForm = (initialValues: any, url: string, onSuccess: () => void) => {
    const [values, setValues] = useState(initialValues);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if passwords match if relevant
        if (values.Password && values.ConfirmPassword && values.Password !== values.ConfirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                onSuccess(); // Call the success function passed in
                navigate({ to: '/home' }); // Navigate upon successful submission
            } else {
                const result = await response.json();
                setError(result.message || "An error occurred. Please try again.");
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again later.');
        }
    };

    return { values, error, handleChange, handleSubmit };
};
