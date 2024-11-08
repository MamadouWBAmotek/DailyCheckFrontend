import { Role } from "../Models/Roles";

export interface User {
    id: number;
    userName: string;
    email: string;
    role: Role;
}