import { expect, Locator, Page } from '@playwright/test';

export class TodoPage {
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly todoInput: Locator;
    readonly todoItems: Locator;
    readonly todoLabel: Locator;
    readonly todoList: Locator;
    readonly todoPageURL: string;

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.locator('h1');
        this.todoInput = page.locator('.new-todo');
        this.todoList = page.locator('.todo-list');
        this.todoItems = page.locator('.todo-list li');
        this.todoLabel = page.locator('label');
        this.todoPageURL = process.env.TODO_PAGE_URL as string;
    }

    async goto() {
        await this.page.goto(this.todoPageURL);
    }

    async assertPageTitle() {
        await expect(this.pageTitle).toBeVisible();
        await expect(this.pageTitle).toHaveText('todos');
    }

    async assertTodoInputToBeVisible() {
        await expect(this.todoInput).toBeVisible();
    }

    async addTodo(todoText: string) {
        await this.todoInput.fill(todoText);
        await this.todoInput.press('Enter');
    }

    async assertTodoToBeVisible(todoText: string) {
        await expect(this.todoLabel.filter({ hasText: todoText })).toBeVisible({
            timeout: 5000,
        });
    }

    async assertTodoNotToBeVisible(todoText: string) {
        await expect(this.todoLabel.filter({ hasText: todoText })).not.toBeVisible({
            timeout: 5000,
        });
    }

    async deleteTodoByName(todoText: string) {
        const todoItem = this.todoItems.filter({ hasText: todoText });
        const toodoDestroy = todoItem.locator('.destroy');

        await expect(todoItem).toBeVisible();
        await todoItem.hover();
        await expect(toodoDestroy).toBeVisible();
        await toodoDestroy.click();
    }

    async assertTodoIsNotCompleted(todoText: string) {
        const todoItem = this.todoItems.filter({ hasText: todoText });
        const toggleCheckbox = todoItem.locator('.toggle');
        const label = todoItem.locator('label');

        await expect(toggleCheckbox).not.toBeChecked();
        await expect(label).toHaveCSS('text-decoration', 'none solid rgb(77, 77, 77)');
    }

    async assertTodoIsCompleted(todoText: string) {
        const todoItem = this.todoItems.filter({ hasText: todoText });
        const toggleCheckbox = todoItem.locator('.toggle');
        const label = todoItem.locator('label');

        await expect(toggleCheckbox).toBeChecked();
        await expect(label).toHaveCSS('text-decoration', 'line-through solid rgb(217, 217, 217)');
    }

    async markTodoAsCompleted(todoText: string) {
        const todoItem = this.todoItems.filter({ hasText: todoText });
        const toggleCheckbox = todoItem.locator('.toggle');

        await toggleCheckbox.check();
    }

    async markTodoAsNotCompleted(todoText: string) {
        const todoItem = this.todoItems.filter({ hasText: todoText });
        const toggleCheckbox = todoItem.locator('.toggle');

        await toggleCheckbox.uncheck();
    }

    async interceptPostTodoRequest(expectedTitle: string) {
        const request = await this.page.waitForRequest(
            (request) =>
                request.url() === this.todoPageURL + '/todos' && request.method() === 'POST',
        );
        const headers = request.headers();
        expect(headers['content-type']).toBe('application/json;charset=UTF-8');

        const postData = JSON.parse(request.postData() || '{}');
        await expect(postData).toHaveProperty('title', expectedTitle);
        await expect(postData).toHaveProperty('completed', false);
        await expect(postData).toHaveProperty('id');
        await expect(typeof postData.id).toBe('string');
    }

    async interceptToggleStatus(todoId: string, completed: boolean = false) {
        const request = await this.page.waitForRequest(
            (request) =>
                request.url() === this.todoPageURL + `/todos/${todoId}` &&
                (request.method() === 'PATCH' || request.method() === 'PUT'),
        );
        const postData = JSON.parse(request.postData() || '{}');
        await expect(postData).toHaveProperty('completed', completed);
        await expect(postData).toHaveProperty('id', todoId);
    }

    async interceptDeleteTodoRequest(todoId: string) {
        const request = await this.page.waitForRequest(
            (request) =>
                request.url() === this.todoPageURL + `/todos/${todoId}` &&
                request.method() === 'DELETE',
        );
        await expect(request.method()).toBe('DELETE');
        await expect(request.url()).toBe(this.todoPageURL + `/todos/${todoId}`);
    }

    async assertTodosCount(expectedCount: number) {
        const tasksCount = await this.todoItems.count();
        await expect(tasksCount).toBe(expectedCount);
    }

    async assertLastTodoTitle(expectedTitle: string) {
        const lastTask = this.todoItems.last();
        await expect(lastTask.locator('label')).toHaveText(expectedTitle);
    }
}
