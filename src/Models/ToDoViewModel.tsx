import { Status } from "./Status";


export interface ToDoViewModel {
    Title: string,
    Description: string
    Deadline: string
    Status?: Status;

}