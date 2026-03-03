# EMS — Employee Management System

A simple fullstack employee management app (local development).

---

## Tech Stack

| Layer    | Technology              |
| -------- | ----------------------- |
| Frontend | React (Vite)            |
| Backend  | Node.js / Express       |
| Storage  | JSON file (via `fs` module) |

> **Future improvement:** The JSON file will be replaced with a proper database later.

---

## Project Structure

```
/
├── backend/
│   ├── index.js          # Express app entry point
│   ├── routes/
│   │   └── employees.js  # CRUD route handlers
│   └── data/
│       └── employees.json
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── EmployeeList.jsx
│   │   │   ├── EmployeeForm.jsx
│   │   │   └── EmployeeCard.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
└── package.json
```

---

## Backend Requirements

### Data Model

Each employee record contains:

| Field        | Type   | Required | Notes                  |
| ------------ | ------ | -------- | ---------------------- |
| id           | string | yes      | UUID, auto-generated   |
| firstName    | string | yes      |                        |
| lastName     | string | yes      |                        |
| email        | string | yes      | Must be unique         |
| department   | string | yes      | e.g. Engineering, HR   |
| position     | string | yes      | Job title              |
| salary       | number | yes      | Annual, in USD         |
| dateOfJoining| string | yes      | ISO date (YYYY-MM-DD)  |

### API Endpoints

All routes are prefixed with `/api/employees`.

| Method | Path               | Description                  |
| ------ | ------------------ | ---------------------------- |
| GET    | `/api/employees`   | List all employees           |
| GET    | `/api/employees/:id` | Get a single employee      |
| POST   | `/api/employees`   | Create a new employee        |
| PUT    | `/api/employees/:id` | Update an existing employee|
| DELETE | `/api/employees/:id` | Delete an employee         |

### Backend Tasks

- [x] Initialize a Node.js project with Express as the sole dependency.
- [x] Write a standard Express app in `backend/index.js` with `app.listen()` on port 3000.
- [x] Use the `fs` module to read/write `backend/data/employees.json` — no database.
- [x] Implement all five CRUD endpoints listed above in `backend/routes/employees.js`.
- [x] Add basic input validation (required fields, valid email format).
- [x] Return appropriate HTTP status codes (200, 201, 400, 404, 500).
- [x] Enable CORS so the Vite dev server (port 5173) can reach the API.

---

## Frontend Requirements

### Pages / Views

The app is a single-page application with the following views:

1. **Employee List** — Default view showing all employees in a card/table layout.
2. **Add Employee** — A form to create a new employee.
3. **Edit Employee** — Pre-filled form to update an existing employee (reuses the same form component).

### Frontend Tasks

- [ ] Scaffold a React app with Vite inside the `client/` folder.
- [ ] Fetch and display all employees on load (GET `/api/employees`).
- [ ] Build a reusable `EmployeeForm` component for both create and edit flows.
- [ ] Support delete with a confirmation prompt.
- [ ] Show basic loading and error states.
- [ ] Keep styling minimal — use plain CSS or a simple utility library.
- [ ] Use `fetch` for all API calls (no extra HTTP libraries needed).

### UI Details

- Employee cards/rows should display: full name, department, position, and email.
- Clicking "Edit" on a card opens the form pre-filled with that employee's data.
- Clicking "Delete" shows a confirm dialog, then removes the record.
- The "Add Employee" button is always visible at the top of the list view.
- Form validation should mirror backend validation (all fields required, email format).

---

## Running Locally

1. Start the backend: `node backend/index.js` (runs on port 3000).
2. Start the frontend: `cd client && npm run dev` (runs on port 5173).
3. The Vite dev server proxies `/api` requests to `http://localhost:3000`.

> **Future:** Once a database is added, the app can be deployed to Vercel,
> Render, Railway, or any Node-compatible host.

---

## Out of Scope (keep it simple)

- Authentication / authorization
- Database (use JSON file for now — upgrade planned)
- Pagination or search/filter
- Unit or integration tests
- CI/CD pipeline
- Production deployment (local only for now)