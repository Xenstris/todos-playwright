export interface Task {
    completed: boolean;
    id: string;
    title: string;
}

export interface TaskArray extends Array<Task> {}
