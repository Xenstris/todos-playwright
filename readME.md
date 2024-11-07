# Todo App with Playwright E2E Tests

This project is a Todo application with end-to-end (E2E) tests written using [Playwright](https://playwright.dev/). This guide will walk you through setting up, running the app, and executing tests to ensure everything is functioning correctly.

## Prerequisites

-   [Node.js](https://nodejs.org/) installed on your machine.

## Setup

1. Change directory:

```
cd .\todos-playwright\
```

2. Install dependencies:

```bash
npm install
```

3. Install playwright browsers:

```bash
npx playwright install
```

4. Start the Todo application:

```bash
npm start
```

5. Configure Environment Variables in **todo.env** file:

```bash
TODO_PAGE_URL=http://localhost:3000
```

5. Run Tests in Interactive UI Mode:

```bash
npx playwright test --ui
```

6. Run Tests on Specific Browser:

```bash
npx playwright test --project=chromium
```
