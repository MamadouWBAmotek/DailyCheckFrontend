import { Status } from "./Status";
export interface ToDo {
    id: number;
    title: string;
    description: string;
    status: Status;
    userEmail: string;
    userId: string;
    deadline: string;
}
