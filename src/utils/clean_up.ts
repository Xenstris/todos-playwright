import { APIRequestContext } from '@playwright/test';
import { todosEndpoint } from '../api_requests/todos_endpoint';
import { Task, TaskArray } from '../types/todo_task_types';

export const cleanUp = {
    deleteAllTodos: async function (apiContext: APIRequestContext) {
        const getAllTasks: TaskArray = await todosEndpoint.getAllTodos(apiContext);
        const taskIdsArray = getAllTasks.map((element: Task) => element.id);

        taskIdsArray.forEach((taskId) => {
            todosEndpoint.deleteTodo(apiContext, taskId);
        });
    },
};
