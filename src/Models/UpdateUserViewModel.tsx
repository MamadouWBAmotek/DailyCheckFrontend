import { Role } from "./Roles";
export interface UserUpdateViewModel {
    id: number;
    userName: string;
    email: string;
    role: Role;
    password: string;
    newPassword: string;
}

