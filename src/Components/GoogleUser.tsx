import { Role } from "../Models/Roles";

export interface GoogleUser {
    id: string;
    userName: string;
    email: string;
    role: Role;
}