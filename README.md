# Habit Tracker API

A RESTful API for tracking daily habits and check-ins, built as a learning project to practice the full backend stack: **PostgreSQL → Prisma → Docker → AWS**.

## Overview

This API lets users create habits, log check-ins, and retrieve their habits along with a full history of logs via a relational join. It started with raw SQL against PostgreSQL, was migrated to Prisma ORM, containerized with Docker, and deployed using a managed cloud database (AWS RDS).

## Tech Stack

- **Runtime:** Node.js, Express
- **Database:** PostgreSQL
- **ORM:** Prisma (v7) with the `@prisma/adapter-pg` driver adapter
- **Containerization:** Docker
- **Cloud Database:** AWS RDS (PostgreSQL)
- **Version Control:** Git & GitHub

## Data Model

```
users
  ├── id (PK)
  ├── email (unique)
  ├── password_hash
  └── created_at

habits
  ├── id (PK)
  ├── user_id (FK → users.id)
  ├── name
  ├── frequency
  └── created_at

habit_logs
  ├── id (PK)
  ├── habit_id (FK → habits.id)
  ├── completed_at
  └── note
```

Each user can have many habits, and each habit can have many logged check-ins. Deleting a user cascades to their habits and logs.

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (local or a connection string to a hosted instance)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/subhan-cloud/API.git
   cd API
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>:5432/habit_tracker
   DB_PORT=5000
   ```
   > If your password contains special characters (e.g. `#`, `@`), URL-encode them (`#` → `%23`).

4. Apply the schema to your database:
   ```bash
   npx prisma db pull      # if connecting to an existing database
   npx prisma generate     # generate the Prisma Client
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The API will be running at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint             | Description                                  |
|--------|-----------------------|-----------------------------------------------|
| GET    | `/`                   | Health check                                  |
| POST   | `/users`              | Create a new user                             |
| POST   | `/habits`             | Create a new habit for a user                 |
| POST   | `/habit-logs`         | Log a habit check-in                          |
| GET    | `/habits/:user_id`    | Get all habits for a user, with their logs    |

### Example Requests

**Create a user**
```http
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "password_hash": "hashed_password_here"
}
```

**Create a habit**
```http
POST /habits
Content-Type: application/json

{
  "user_id": 1,
  "name": "Drink water",
  "frequency": "daily"
}
```

**Log a check-in**
```http
POST /habit-logs
Content-Type: application/json

{
  "habit_id": 1,
  "note": "Drank 2 liters today"
}
```

**Get habits with logs**
```http
GET /habits/1
```

## Running with Docker

A `Dockerfile` and `docker-compose.yml` are included for containerized local development:

```bash
docker-compose up --build
```

This spins up two containers:
- `app` — the Node.js/Express API
- `db` — a PostgreSQL instance with persistent storage

> Note: Docker requires hardware virtualization support (Intel VT-x / AMD-V) to be enabled on your machine.

## Deployment

This project uses a managed **PostgreSQL database on AWS RDS** for production/cloud data storage, with the API deployable to any Docker-compatible hosting platform (e.g. Render, Railway, or AWS ECS/Fargate).

Environment variables required in production:
- `DATABASE_URL` — full connection string to the production database
- `DB_PORT` — port the server listens on

## Project Structure

```
API/
├── index.js              # Express app & route definitions
├── package.json
├── .env                  # Environment variables (not committed)
├── .gitignore
├── schema.sql             # Raw SQL schema reference
├── Dockerfile
├── docker-compose.yml
└── prisma/
    ├── schema.prisma      # Prisma data model
    └── migrations/
```

## Roadmap

- [✔] PostgreSQL schema & raw SQL queries
- [✔] Migrate to Prisma ORM
- [✔] Dockerize the application
- [✔] Deploy database to AWS RDS
- [✔] Deploy API to a cloud hosting platform
- [ ] Add authentication (JWT)
- [ ] Add streak calculation logic
- [ ] Add automated tests

## License

ISC
