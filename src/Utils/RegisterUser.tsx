// src/utils/registerUser.ts

import { GoogleUser } from "../Components/GoogleUser";
import { User } from "../Components/User";
import { Role } from "../Models/Roles";

interface RegistrationViewModel {
    UserName: string;
    Email: string;
    Password: string;
    ConfirmPassword: string;
}

interface RegisterUserResponse {
    user?: User;  // Type d'objet utilisateur, à remplacer par le type exact si disponible
    error?: string | null;
}

export const registerUser = async (
    userName: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: Role
): Promise<RegisterUserResponse> => {
    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
        return { error: "Les mots de passe ne correspondent pas." };
    }

    const model: RegistrationViewModel & Partial<{ Role: Role }> = {
        UserName: userName,
        Email: email,
        Password: password,
        ConfirmPassword: confirmPassword,
        ...(role != null ? { Role: role } : null),  // Ajouter `Role` uniquement si `role` n'est pas null

    };
    console.log(role);
    console.log(model.Role);


    try {
        const response = await fetch('http://localhost:5144/api/login/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(model),
        });
        console.log("this is the model", model);
        const data = await response.json();

        if (response.ok) {
            console.log(data)
            return { user: data.user };
        } else {
            console.log(data)
            return { error: data.message };
        }
    } catch (err) {
        return { error: 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.' };
    }
};
