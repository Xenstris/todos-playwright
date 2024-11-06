import { APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';

const endpoint = 'http://localhost:3000/todos';

export const todosEndpoint = {
    async getAllTodos(apiContext: APIRequestContext) {
        const getAllTodosResponse = await apiContext.get(endpoint);
        return getAllTodosResponse.json();
    },

    async deleteTodo(apiContext: APIRequestContext, id: string) {
        const deleteTodoResponse = await apiContext.delete(endpoint + `/${id}`);
        if (!deleteTodoResponse.ok()) {
            throw new Error(
                `Error: ${deleteTodoResponse.status()} - task with following id could not be deleted: ${id}`,
            );
        }
    },

    async createTodo(
        apiContext: APIRequestContext,
        title: string = faker.lorem.sentence(),
        completed: boolean = false,
        id: string = Math.random().toString().substr(2, 10),
        failOnStatusCode: boolean = true,
    ) {
        const addTodoResponse = await apiContext.post(endpoint, {
            data: {
                completed: completed,
                id: id,
                title: title,
            },
            headers: {
                'Content-Type': 'application/json',
            },
            failOnStatusCode: failOnStatusCode,
        });
        if (!addTodoResponse.ok() && failOnStatusCode === true) {
            throw new Error(`Error: ${addTodoResponse.status()} - task could not be created`);
        }

        const values = { addTodoResponse: addTodoResponse, id: id, title: title };
        return values;
    },
};
