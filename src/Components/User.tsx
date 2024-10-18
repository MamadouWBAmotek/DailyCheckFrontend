import { Role } from "./Roles";

export interface User {
    id: string;
    username: string;
    email: string;
    role: Role;
}