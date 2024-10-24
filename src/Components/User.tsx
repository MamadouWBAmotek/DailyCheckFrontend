import { Role } from "./Roles";

export interface User {
    id: string;
    userName: string;
    email: string;
    role: Role;
}