// models/ToDo.t
import { Status } from "./Status";
export interface ToDo {
    id: number;
    title: string;
    description: string;
    Status: Status;
    userId: string;
    deadline: string;
}
