import { Role } from "./Roles";

export interface GoogleUser {
    id: string;
    username: string;
    email: string;
    role: Role;
}