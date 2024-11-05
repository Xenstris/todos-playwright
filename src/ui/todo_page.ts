import { expect, Locator, Page } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly pageTtile: Locator;
  readonly todoInput: Locator;
  readonly todoItems: Locator;
  readonly todoLabel:Locator;
  readonly todoList: Locator;
  readonly todoPageURL: string;

  constructor(page: Page) {
    this.page = page;
    this.pageTtile = page.locator('h1');
    this.todoInput = page.locator('.new-todo');
    this.todoList = page.locator('.todo-list');
    this.todoItems = page.locator('.todo-list li');
    this.todoLabel = page.locator('label');
    this.todoPageURL = "http://localhost:3000"
  };

  async goto() {
    await this.page.goto(this.todoPageURL);
  };

  async expectPageTitle() {
    await expect(this.pageTtile).toBeVisible();
    await expect(this.pageTtile).toHaveText('todos');
  };

  async expectTodoInputToBeVisible() {
    await expect(this.todoInput).toBeVisible();
  };

  async addTodo(todoText: string) {
    await this.todoInput.fill(todoText);
    await this.todoInput.press('Enter');
  };

  async expectTodoToBeVisible(todoText: string) {
    await expect(this.todoLabel.filter({ hasText: todoText })).toBeVisible({ timeout: 5000 });
  };

  async expectTodoNotToBeVisible(todoText: string) {
    await expect(this.todoLabel.filter({ hasText: todoText })).not.toBeVisible({ timeout: 5000 });
  };

  async deleteTodoByName(todoText: string) {
    const todoItem = this.todoItems.filter({ hasText: todoText });
    const toodoDestroy = todoItem.locator('.destroy')

    await expect(todoItem).toBeVisible();
    await todoItem.hover();
    await expect(toodoDestroy).toBeVisible();
    await toodoDestroy.click();
  };

  async expectTodoNotCompleted(todoText: string) {
    const todoItem = this.todoItems.filter({ hasText: todoText });
    const toggleCheckbox = todoItem.locator('.toggle');
    const label = todoItem.locator('label');

    await expect(toggleCheckbox).not.toBeChecked();
    await expect(label).toHaveCSS('text-decoration', 'none solid rgb(77, 77, 77)');
  };

  async expectTodoCompleted(todoText: string) {
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
        request.url() === this.todoPageURL + '/todos' &&
        request.method() === 'POST'
    );
    expect(request.method()).toBe('POST');
    expect(request.url()).toBe(this.todoPageURL + '/todos');
  
    const headers = request.headers();
    expect(headers['content-type']).toBe('application/json;charset=UTF-8');
  
    const postData = JSON.parse(request.postData() || '{}');
    expect(postData).toHaveProperty('title', expectedTitle);
    expect(postData).toHaveProperty('completed', false);
    expect(postData).toHaveProperty('id');
    expect(typeof postData.id).toBe('string');
  }

  async interceptToggleStatus(todoId: string, completed: boolean = false) {
    const request = await this.page.waitForRequest(
      (request) =>
        request.url() === this.todoPageURL + `/todos/${todoId}` &&
        (request.method() === 'PATCH' || request.method() === 'PUT')
    );

    expect(request.method()).toMatch(/PATCH|PUT/);
    expect(request.url()).toBe(this.todoPageURL + `/todos/${todoId}`);
  
    const postData = JSON.parse(request.postData() || '{}');
    expect(postData).toHaveProperty('completed', completed);
    expect(postData).toHaveProperty('id', todoId);
  };
  
  async interceptDeleteTodoRequest(todoId: string) {
    const request = await this.page.waitForRequest(
      (request) =>
        request.url() === this.todoPageURL + `/todos/${todoId}` &&
        request.method() === 'DELETE'
    );
  
    expect(request.method()).toBe('DELETE');
    expect(request.url()).toBe(this.todoPageURL + `/todos/${todoId}`);
  };
  

  async expectTodosCount(expectedCount: number) {
    const tasksCount = await this.todoItems.count();
    expect(tasksCount).toBe(expectedCount);
  };

  async expectLastTaskTitle(expectedTitle: string) {
    const lastTask = this.todoItems.last();
    await expect(lastTask.locator('label')).toHaveText(expectedTitle);
  };

  async tryAddEmptyTodo() {
    await this.todoInput.fill('')
    await this.todoInput.press('Enter');
  };
};

