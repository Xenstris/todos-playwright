import { test } from '@playwright/test';
import { TodoPage } from '../src/ui/todo_page';
import { cleanUp } from '../src/utils/clean_up';
import { preconditions } from '../src/utils/preconditions';
import { faker } from '@faker-js/faker';
import { todosEndpoint } from '../src/api_requests/todos_endpoint';

test.beforeEach('Clean environment before each test', async ({ request }) => {
    await cleanUp.deleteAllTodos(request);
});

test.describe('TodoPage tests', () => {
    test('Title and input field visibility', async ({ page }) => {
        const todoPage = new TodoPage(page);

        await todoPage.goto();
        await todoPage.assertPageTitle();
        await todoPage.assertTodoInputToBeVisible();
    });

    test('User can add new todo', async ({ page }) => {
        const todoTitle = faker.lorem.sentence();
        const todoPage = new TodoPage(page);

        await todoPage.goto();
        await todoPage.addTodo(todoTitle);
        await todoPage.assertTodoToBeVisible(todoTitle);
        await todoPage.assertTodoIsNotCompleted(todoTitle);
    });

    test('Request is sent when user adds new todo', async ({ page }) => {
        const todoTitle = faker.lorem.sentence();
        const todoPage = new TodoPage(page);

        await todoPage.goto();
        todoPage.interceptPostTodoRequest(todoTitle);
        await todoPage.addTodo(todoTitle);
    });

    test('User can mark todo as done', async ({ request, page }) => {
        const todoTitle = faker.lorem.sentence();
        const todoPage = new TodoPage(page);
        await todosEndpoint.createTodo(request, todoTitle);

        await todoPage.goto();
        await todoPage.markTodoAsCompleted(todoTitle);
        await todoPage.assertTodoIsCompleted(todoTitle);
    });

    test('Request is sent when user marks todo as done', async ({ request, page }) => {
        const todoTitle = faker.lorem.sentence();
        const todoPage = new TodoPage(page);
        const newToDoResponse = await todosEndpoint.createTodo(request, todoTitle);

        await todoPage.goto();
        todoPage.interceptToggleStatus(newToDoResponse.id, true);
        await todoPage.markTodoAsCompleted(todoTitle);
    });

    test('User can mark todo as not done', async ({ request, page }) => {
        const todoTitle = faker.lorem.sentence();
        const todoPage = new TodoPage(page);
        await todosEndpoint.createTodo(request, todoTitle, false);

        await todoPage.goto();
        await todoPage.markTodoAsNotCompleted(todoTitle);
        await todoPage.assertTodoIsNotCompleted(todoTitle);
    });

    test('Request is sent when user marks todo as not done', async ({ request, page }) => {
        const todoTitle = faker.lorem.sentence();
        const todoPage = new TodoPage(page);
        const newToDoResponse = await todosEndpoint.createTodo(request, todoTitle, false);

        await todoPage.goto();
        todoPage.interceptToggleStatus(newToDoResponse.id, false);
        await todoPage.markTodoAsNotCompleted(todoTitle);
    });

    test('User can delete todo', async ({ request, page }) => {
        const todoTitle = faker.lorem.sentence();
        const todoPage = new TodoPage(page);
        await todosEndpoint.createTodo(request, todoTitle);

        await todoPage.goto();
        await todoPage.deleteTodoByName(todoTitle);
        await todoPage.assertTodoNotToBeVisible(todoTitle);
    });

    test('Request is sent when user deletes todo', async ({ request, page }) => {
        const todoTitle = faker.lorem.sentence();
        const todoPage = new TodoPage(page);
        const newToDoResponse = await todosEndpoint.createTodo(request, todoTitle);

        await todoPage.goto();
        todoPage.interceptDeleteTodoRequest(newToDoResponse.id);
        await todoPage.deleteTodoByName(todoTitle);
    });

    test('Multiple todos are displayed and new todo is added as last', async ({
        request,
        page,
    }) => {
        const todoTitle = faker.lorem.sentence();
        const todoPage = new TodoPage(page);
        const numberOfTodos = await preconditions.createMultipleTodos(request);

        await todoPage.goto();
        await todoPage.addTodo(todoTitle);
        await todoPage.assertTodoToBeVisible(todoTitle);
        await todoPage.assertTodosCount(numberOfTodos + 1);
        await todoPage.assertLastTodoTitle(todoTitle);
    });

    test('User is not able to create todo without title', async ({ page }) => {
        const todoPage = new TodoPage(page);

        await todoPage.goto();
        await todoPage.addTodo('');
        await todoPage.assertTodosCount(0);
    });
});
