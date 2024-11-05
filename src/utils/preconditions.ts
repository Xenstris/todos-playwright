import { APIRequestContext, Page } from "@playwright/test";
import { todosEndpoint } from "../api_requests/todos_endpoint";

export const preconditions = {
    createMutipleTodos: async function (
        apiContext: APIRequestContext, 
        numberofTasks: number = Math.floor(Math.random() * (5 - 2 + 1)) + 2) {
        for(let i=0; i<numberofTasks; i++) {
            await todosEndpoint.createTodo(apiContext);
        };
        return numberofTasks
    }, 
};