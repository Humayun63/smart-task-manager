# Smart Task Manager

A comprehensive full-stack task management application built with React, TypeScript, Node.js, Express, and MongoDB. This application enables teams to efficiently manage projects, tasks, and team members with real-time activity tracking and intelligent task distribution.

## 🌐 Live Demo

- **Frontend**: [https://smart-task-manager-client-three.vercel.app/](https://smart-task-manager-client-three.vercel.app/)
- **Backend API**: [https://stm-server-liard.vercel.app/](https://stm-server-liard.vercel.app/)

## ✨ Features

### Core Functionality
- 🔐 **User Authentication**: Secure registration and login with JWT-based authentication
- 👥 **Team Management**: Create and manage teams with multiple members
- 📊 **Project Management**: Organize work into projects with detailed tracking
- ✅ **Task Management**: Create, assign, and track tasks with priority levels
- 📈 **Dashboard Analytics**: View team workload, recent activities, and task statistics
- 🔄 **Task Reassignment**: Intelligently reassign tasks between team members
- 📝 **Activity Logging**: Track all actions and changes across the system
- 🎨 **Kanban Board**: Visual task management with drag-and-drop functionality
- 🌓 **Dark/Light Theme**: Toggle between light and dark modes

### Additional Features
- Real-time team load balancing
- Task filtering and sorting
- Member workload visualization
- Recent reassignments tracking
- Protected routes and role-based access
- Responsive design for all devices

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.1.1
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.1.12
- **State Management**: Redux Toolkit
- **Routing**: React Router 7.9.6
- **UI Components**: 
  - Radix UI primitives
  - Ant Design 5.29.1
  - Lucide React (icons)
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.1.0
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose 8.18.0)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod 4.1.5
- **CORS**: CORS 2.8.5

### Deployment
- **Frontend & Backend**: Vercel

## 📁 Project Structure

```
smart-task-manager/
├── backend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── config/         # Environment configuration
│   │   │   ├── errorHelpers/   # Custom error handlers
│   │   │   ├── middlewares/    # Auth guard, error handlers
│   │   │   ├── modules/        # Feature modules
│   │   │   │   ├── auth/       # Authentication
│   │   │   │   ├── team/       # Team management
│   │   │   │   ├── project/    # Project management
│   │   │   │   ├── task/       # Task management
│   │   │   │   ├── dashboard/  # Dashboard analytics
│   │   │   │   ├── activityLog/# Activity tracking
│   │   │   │   └── user/       # User management
│   │   │   ├── routes/         # API route definitions
│   │   │   └── utils/          # Utility functions
│   │   ├── app.ts              # Express app setup
│   │   └── server.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/         # Reusable UI components
    │   │   ├── dashboard/      # Dashboard widgets
    │   │   ├── projects/       # Project components
    │   │   ├── tasks/          # Task components
    │   │   ├── teams/          # Team components
    │   │   └── ui/             # Base UI components
    │   ├── context/            # React contexts
    │   ├── layouts/            # Layout components
    │   ├── pages/              # Page components
    │   ├── redux/              # Redux store and slices
    │   ├── router/             # Router configuration
    │   ├── services/           # API service layer
    │   ├── types/              # TypeScript type definitions
    │   └── utils/              # Utility functions
    ├── package.json
    └── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user

### Teams
- `GET /api/v1/teams` - Get all teams
- `POST /api/v1/teams` - Create new team
- `GET /api/v1/teams/:id` - Get team by ID
- `PUT /api/v1/teams/:id` - Update team
- `DELETE /api/v1/teams/:id` - Delete team

### Projects
- `GET /api/v1/projects` - Get all projects
- `POST /api/v1/projects` - Create new project
- `GET /api/v1/projects/:id` - Get project by ID
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

### Tasks
- `GET /api/v1/tasks` - Get all tasks
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/:id` - Get task by ID
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard statistics

### Activity Logs
- `GET /api/v1/activity-log` - Get activity logs

## 🔒 Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt
- CORS configuration for secure cross-origin requests
- Request validation using Zod schemas
- Protected routes with authentication guards
- Global error handling middleware

## 🎨 UI Components

The application uses a modern, accessible component library built with:
- Radix UI for accessible primitives
- Tailwind CSS for styling
- Custom theme support (light/dark mode)
- Responsive design patterns
- Smooth animations and transitions

## 👤 Author

**Md Humayun Kabir**

## 📄 License

ISC License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 Notes

- The application uses cookie-based authentication for secure session management
- All API responses follow a consistent structure
- Activity logs track all significant actions in the system
- The dashboard provides real-time insights into team performance and task distribution

---

Made with ❤️ using React, TypeScript, and Node.js
