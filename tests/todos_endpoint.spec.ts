import { expect, test } from '@playwright/test';
import { cleanUp } from '../src/utils/clean_up';
import { todosEndpoint } from '../src/api_requests/todos_endpoint';
import { preconditions } from '../src/utils/preconditions';
import { TaskArray } from '../src/types/todo_task_types';

test.beforeEach('Clean environment before each test', async ({ request }) => {
    await cleanUp.deleteAllTodos(request);
});

test.describe('Todos endpoint tests', () => {
    test('Create todo', async ({ request, page }) => {
        await todosEndpoint.createTodo(request);
        const arrayOfTasks: TaskArray = await todosEndpoint.getAllTodos(request);
        expect(arrayOfTasks.length).toEqual(1);
    });

    test('Delete todo', async ({ request, page }) => {
        const createdTodoResponse = await todosEndpoint.createTodo(request);
        await todosEndpoint.deleteTodo(request, createdTodoResponse.id);
        const emptyArrayOfTasks: TaskArray = await todosEndpoint.getAllTodos(request);
        expect(emptyArrayOfTasks.length).toEqual(0);
    });

    test('Create multiple todos', async ({ request, page }) => {
        const numberOfTasks: number = await preconditions.createMultipleTodos(request);
        const arrayOfTasks: TaskArray = await todosEndpoint.getAllTodos(request);
        expect(arrayOfTasks.length).toEqual(numberOfTasks);
    });

    test('Create 2 todos with same id', async ({ request, page }) => {
        const createdTodo = await todosEndpoint.createTodo(
            request,
            undefined,
            undefined,
            undefined,
            false,
        );
        const taskWithSameIdResponse = await todosEndpoint.createTodo(
            request,
            undefined,
            undefined,
            createdTodo.id,
            false,
        );
        expect(taskWithSameIdResponse.addTodoResponse.status()).toBe(500);
    });
});
