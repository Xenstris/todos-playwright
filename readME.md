# Todo App with Playwright E2E Tests

This project is a Todo application with end-to-end (E2E) tests written using [Playwright](https://playwright.dev/). This guide will walk you through setting up, running the app, and executing tests to ensure everything is functioning correctly.

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install dependencies:
```bash
npx playwright install
```

3. To start the Todo application:
```bash
npm start
```

4. Configure Environment Variables:
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
