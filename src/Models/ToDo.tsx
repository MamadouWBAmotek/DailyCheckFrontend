// models/ToDo.t
import { Status } from "./Status";
export interface ToDo {
    id: number;
    title: string;
    description: string;
    state: Status,
    userId: number;
    deadline: Date;
}
