Team Project Management System

A full-stack team project management system built for the Cairo University Racing Team – Formula Student. The application allows team members to manage projects, project members, tasks, task assignments, priorities, and statuses through a responsive web interface.

Project Overview

The Team Project Management System provides a centralized workspace for managing racing-team projects and day-to-day tasks.

Core Features

User registration and login with password hashing and JWT authentication.

Persistent authentication across page refreshes.

Protected frontend routes and authenticated API requests.

Project creation, viewing, updating, and deletion.

Project ownership enforcement.

Project member management.

Task creation, viewing, updating, and deletion.

Task assignment to project members.

Task status management:

To Do

In Progress

Done

Task priority management:

Low

Medium

High

My Tasks page with filtering by:

Status

Priority

Project

Dashboard with user/project/task summaries.

Profile management:

Update account information

Change password

Delete account

Reusable modal and confirmation modal components.

Loading, empty, and error states.

Responsive UI.

Technologies Used

Frontend

React

Vite

React Router

Tailwind CSS

Axios

Lucide React

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT (jsonwebtoken)

bcryptjs

CORS

dotenv

Database

MongoDB / MongoDB Atlas

Project Structure

project-root/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── utils/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── utils/
│
└── README.md

Adjust the folder names above if your actual repository keeps the frontend/backend folders at a different level.

Setup Instructions

Prerequisites

Make sure you have:

Node.js installed

npm installed

MongoDB installed locally, or a MongoDB Atlas cluster

Git installed

Backend Setup

Open the backend directory:

cd backend

Install dependencies:

npm install

Create a .env file:

PORT=3000
DATABASE_URL=mongodb://127.0.0.1:27017/team-project-management
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173

For MongoDB Atlas, replace DATABASE_URL with your Atlas connection string.

Run the backend in development:

npm run dev

Or run normally:

npm start

The backend will run on:

http://localhost:3000

Frontend Setup

Open the frontend directory:

cd frontend

Install dependencies:

npm install

Create a frontend environment file if the project uses a Vite API URL:

VITE_API_URL=http://localhost:3000/api

Run the frontend:

npm run dev

The frontend will normally run on:

http://localhost:5173

Important Deployment Configuration

Before deploying the frontend, do not keep the API URL hard-coded to localhost.

Use:

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "content-type": "application/json",
  },
});

Then configure the production environment variable on the hosting platform:

VITE_API_URL=https://team-project-management-system-production.up.railway.app/api

Database Setup / Migration

This project uses MongoDB with Mongoose.

No SQL-style migration scripts are required.

Local MongoDB

Make sure MongoDB is running locally, then use:

DATABASE_URL=mongodb://127.0.0.1:27017/team-project-management

The application will create the required collections/documents through Mongoose when data is inserted.

MongoDB Atlas

For a deployed environment:

Create a MongoDB Atlas cluster.

Create a database user.

Configure Network Access / IP Access List so the deployed backend can connect.

Copy the application connection string.

Set it as the backend DATABASE_URL environment variable.

Database Design

User

User
├── _id
├── firstName
├── secondName
├── username (unique)
├── email (unique)
├── password (hashed)
├── createdAt
└── updatedAt

Project

Project
├── _id
├── name
├── description
├── owner → User
├── members[] → User
├── createdAt
└── updatedAt

Task

Task
├── _id
├── title
├── description
├── assignedTo → User
├── projectId → Project
├── priority
├── status
├── createdAt
└── updatedAt

Relationships

User
 ├── owns → Project
 ├── member of → Project
 └── assigned to → Task

Project
 ├── owner → User
 ├── members[] → User
 └── contains → Task

Task
 ├── assignedTo → User
 └── projectId → Project

Authentication Flow

Registration

Register request
      ↓
Validate user data
      ↓
Hash password with bcrypt
      ↓
Store user
      ↓
Return user data without password

Login

Login request
      ↓
Find user
      ↓
Read hashed password
      ↓
Compare password with bcrypt
      ↓
Generate JWT
      ↓
Return JWT + user information

Authenticated Request

Client request
      ↓
Axios request interceptor
      ↓
Authorization: Bearer <JWT>
      ↓
JWT middleware
      ↓
Verify token
      ↓
req.user
      ↓
Controller

API Documentation

Base URL:

/api

Authentication

Register

POST /api/users/register

Request body:

{
  "firstName": "Ahmed",
  "secondName": "Mohamed",
  "username": "ahmed123",
  "email": "ahmed@example.com",
  "password": "12345678"
}

Login

POST /api/users/login

Request body:

{
  "email": "ahmed@example.com",
  "password": "12345678"
}

Returns a JWT token and authenticated user information.

User / Account

Get Current Profile

GET /api/users/profile
Authorization: Bearer <token>

Update Profile

PATCH /api/users/profile
Authorization: Bearer <token>

Change Password

PATCH /api/users/change-password
Authorization: Bearer <token>

Example request:

{
  "currentPassword": "12345678",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}

Delete Account

DELETE /api/users/profile
Authorization: Bearer <token>

Get Users

GET /api/users
Authorization: Bearer <token>

Projects

Create Project

POST /api/projects
Authorization: Bearer <token>

Get Projects

GET /api/projects
Authorization: Bearer <token>

Get Project by ID

GET /api/projects/:id
Authorization: Bearer <token>

Update Project

PATCH /api/projects/:id
Authorization: Bearer <token>

Delete Project

DELETE /api/projects/:id
Authorization: Bearer <token>

Add Project Member

POST /api/projects/:id/members
Authorization: Bearer <token>

Request body:

{
  "userId": "USER_ID"
}

Remove Project Member

DELETE /api/projects/:id/members/:userId
Authorization: Bearer <token>

Tasks

Create Task

POST /api/tasks
Authorization: Bearer <token>

Example request:

{
  "title": "Design front wing",
  "description": "Prepare the initial front wing design.",
  "projectId": "PROJECT_ID",
  "assignedTo": "USER_ID",
  "priority": "High",
  "status": "To Do"
}

Get My Tasks

GET /api/tasks
Authorization: Bearer <token>

Returns tasks assigned to the authenticated user.

Get Project Tasks

GET /api/tasks?projectId=PROJECT_ID
Authorization: Bearer <token>

Returns the tasks belonging to the specified project when the authenticated user is a project member.

Get Task by ID

GET /api/tasks/:id
Authorization: Bearer <token>

Update Task

PATCH /api/tasks/:id
Authorization: Bearer <token>

Delete Task

DELETE /api/tasks/:id
Authorization: Bearer <token>

Authorization Rules

A user must be authenticated to access protected application resources.

The project owner is taken from the authenticated JWT user and is not trusted from frontend input.

The project owner is automatically added to the project members list.

Only the project owner can update or delete a project.

Only the project owner can manage project members.

A task can only be assigned to an existing user.

The assigned user must belong to the task's project.

Project/task access is checked using authenticated user information.

Additional Features / Assumptions

Additional Features

Reusable modal component for dynamic forms.

Reusable confirmation modal for destructive actions.

Dashboard summary cards.

Task status and priority visual indicators.

Combined task filters by status, priority, and project.

Protected routes on the frontend.

Automatic JWT attachment through Axios interceptors.

Automatic logout/redirect when an authenticated API request returns 401.

Assumptions

A project owner is also a project member.

Only authenticated users can access project/task application resources.

Project ownership controls project editing/deletion and member management.

Task assignment is restricted to project members.

MongoDB is used as the persistent database.

No SQL migration system is required.

Deployment

Frontend

Recommended hosting option:

Vercel

Set:

VITE_API_URL=https://team-project-management-system-production.up.railway.app/api

Backend

Recommended hosting option:

Railway

Set the backend environment variables:

PORT=3000
DATABASE_URL=YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET
CLIENT_URL=https://team-project-management-system-f5y49zuf7-a-d75f.vercel.app

Live Links

Frontend:

https://team-project-management-system-f5y49zuf7-a-d75f.vercel.app

Backend:

https://team-project-management-system-production.up.railway.app

Local Development

If the project is not deployed, run both applications locally:

Terminal 1 - Backend

cd backend
npm install
npm run dev

Terminal 2 - Frontend

cd frontend
npm install
npm run dev

Then open:

http://localhost:5173

Submission

This repository is submitted as a public GitHub repository.

The submission should also include:

Public GitHub repository link

Frontend deployed link

Backend deployed link

.env files as requested by the evaluator

Public Google Drive link to the 5–10 minute explanation video

Repository

GitHub:

https://github.com/adham-19/Team-Project-Management-System