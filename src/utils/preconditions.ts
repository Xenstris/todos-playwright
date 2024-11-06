import { APIRequestContext } from '@playwright/test';
import { todosEndpoint } from '../api_requests/todos_endpoint';

export const preconditions = {
    createMultipleTodos: async function (
        apiContext: APIRequestContext,
        numberOfTasks: number = Math.floor(Math.random() * (5 - 2 + 1)) + 2,
    ) {
        for (let i = 0; i < numberOfTasks; i++) {
            await todosEndpoint.createTodo(apiContext);
        }
        return numberOfTasks;
    },
};
