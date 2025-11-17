# Smart Task Manager

A comprehensive task management system built with Node.js, Express, TypeScript, and MongoDB. This API enables teams to manage projects, assign tasks, track activities, and monitor team workload with intelligent analytics.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Frontend Integration Guide](#frontend-integration-guide)
- [Database Schema](#database-schema)
- [Contributing](#contributing)

## ✨ Features

### Core Functionality
- **User Authentication**: Secure registration, login, and JWT-based authentication
- **Team Management**: Create teams, add/remove members with roles and capacity
- **Project Management**: Organize work by projects linked to teams
- **Task Management**: Create, assign, and track tasks with priorities and statuses
- **Activity Logging**: Automatic tracking of important actions and changes
- **Dashboard Analytics**: Real-time insights into workload, capacity, and recent activities

### Advanced Features
- ✅ Task filtering by project, member, priority, and status
- ✅ Team member capacity tracking and overload detection
- ✅ Activity log filtering by team, project, and task
- ✅ Project-level task viewing (regardless of task owner)
- ✅ Member workload analytics with capacity monitoring
- ✅ Recent reassignment tracking

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Security**: bcrypt for password hashing
- **HTTP Status**: http-status-codes

## 📁 Project Structure

```
backend/
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   └── env.ts                    # Environment configuration
│   │   ├── errorHelpers/
│   │   │   └── AppError.ts               # Custom error handler
│   │   ├── middlewares/
│   │   │   ├── authGuard.ts              # JWT authentication middleware
│   │   │   ├── globalErrorHandler.ts     # Global error handler
│   │   │   └── notFound.ts               # 404 handler
│   │   ├── modules/
│   │   │   ├── auth/                     # Authentication module
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.interface.ts
│   │   │   │   ├── auth.model.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.validation.ts
│   │   │   ├── team/                     # Team management module
│   │   │   │   ├── team.controller.ts
│   │   │   │   ├── team.interface.ts
│   │   │   │   ├── team.model.ts
│   │   │   │   └── team.routes.ts
│   │   │   ├── project/                  # Project management module
│   │   │   │   ├── project.controller.ts
│   │   │   │   ├── project.interface.ts
│   │   │   │   ├── project.model.ts
│   │   │   │   └── project.routes.ts
│   │   │   ├── task/                     # Task management module
│   │   │   │   ├── task.controller.ts
│   │   │   │   ├── task.interface.ts
│   │   │   │   ├── task.model.ts
│   │   │   │   └── task.routes.ts
│   │   │   ├── activityLog/              # Activity logging module
│   │   │   │   ├── activityLog.controller.ts
│   │   │   │   ├── activityLog.interface.ts
│   │   │   │   ├── activityLog.model.ts
│   │   │   │   └── activityLog.routes.ts
│   │   │   └── dashboard/                # Dashboard analytics module
│   │   │       ├── dashboard.controller.ts
│   │   │       ├── dashboard.interface.ts
│   │   │       └── dashboard.routes.ts
│   │   ├── routes/
│   │   │   └── index.ts                  # Central route configuration
│   │   └── utils/
│   │       ├── catchAsync.ts             # Async error handler
│   │       ├── jwt.ts                    # JWT utilities
│   │       └── setCookie.ts              # Cookie utilities
│   ├── app.ts                            # Express app configuration
│   └── server.ts                         # Server entry point
├── eslint.config.mjs                     # ESLint configuration
├── package.json                          # Dependencies
├── tsconfig.json                         # TypeScript configuration
└── Readme.md                             # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-task-manager/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smart-task-manager
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🔐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (development/production) | development | No |
| `PORT` | Server port | 5000 | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | 7d | No |

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Logout User
```http
POST /auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Team Endpoints

#### Create Team
```http
POST /teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Engineering Team"
}

Response: 201 Created
{
  "success": true,
  "message": "Team created successfully",
  "data": {
    "team": {
      "id": "...",
      "name": "Engineering Team",
      "owner": "...",
      "members": []
    }
  }
}
```

#### Add Team Members
```http
POST /teams/:teamId/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "members": [
    {
      "name": "John Doe",
      "role": "Frontend Developer",
      "capacity": 40
    },
    {
      "name": "Jane Smith",
      "role": "Backend Developer",
      "capacity": 35
    }
  ]
}
```

#### List Teams
```http
GET /teams
Authorization: Bearer <token>
```

#### Get Single Team
```http
GET /teams/:teamId
Authorization: Bearer <token>
```

#### Update Team
```http
PUT /teams/:teamId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Team Name"
}
```

#### Delete Team
```http
DELETE /teams/:teamId
Authorization: Bearer <token>
```

#### Get Team Members
```http
GET /teams/:teamId/members
Authorization: Bearer <token>
```

#### Update Team Member
```http
PUT /teams/:teamId/members/:memberId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "role": "Senior Developer",
  "capacity": 45
}
```

#### Delete Team Member
```http
DELETE /teams/:teamId/members/:memberId
Authorization: Bearer <token>
```

### Project Endpoints

#### Create Project
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Complete redesign of company website",
  "team": "team-id-here"
}
```

#### List Projects
```http
GET /projects
Authorization: Bearer <token>
```

#### Get Single Project
```http
GET /projects/:id
Authorization: Bearer <token>
```

#### Update Project
```http
PUT /projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "description": "Updated description",
  "team": "new-team-id"
}
```

#### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer <token>
```

### Task Endpoints

#### Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Implement login page",
  "description": "Create a responsive login page with form validation",
  "priority": "High",
  "status": "Pending",
  "project": "project-id-here",
  "assignedMember": "member-id-here"
}

Priority: "Low" | "Medium" | "High"
Status: "Pending" | "In Progress" | "Done"
```

#### List Tasks (with filters)
```http
GET /tasks?project=xxx&member=xxx&priority=High&status=In Progress
Authorization: Bearer <token>
```

#### Get Tasks by Project
```http
GET /tasks/project/:projectId?member=xxx&priority=xxx&status=xxx
Authorization: Bearer <token>
```

#### Get Single Task
```http
GET /tasks/:id
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "Medium",
  "status": "In Progress",
  "assignedMember": "member-id-here"
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

### Activity Log Endpoints

#### Create Activity Log
```http
POST /activity-log
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "task-id-here",
  "projectId": "project-id-here",
  "teamId": "team-id-here",
  "message": "Task assigned to John Doe"
}
```

#### Get Activity Logs (with filters)
```http
GET /activity-log?teamId=xxx&projectId=xxx&taskId=xxx&limit=50
Authorization: Bearer <token>
```

#### Get Single Activity Log
```http
GET /activity-log/:id
Authorization: Bearer <token>
```

### Dashboard Endpoint

#### Get Dashboard Analytics
```http
GET /dashboard?teamId=xxx&projectId=xxx
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "totalProjects": 5,
    "totalTasks": 23,
    "teamSummary": [
      {
        "memberId": "...",
        "memberName": "John Doe",
        "memberRole": "Developer",
        "currentTasks": 8,
        "capacity": 5,
        "overloaded": true
      }
    ],
    "recentReassignments": [
      {
        "id": "...",
        "message": "Task reassigned to Jane Smith",
        "timestamp": "2025-11-18T10:30:00.000Z",
        "taskId": {...},
        "projectId": {...},
        "createdBy": {...}
      }
    ],
    "filters": {
      "teamId": null,
      "projectId": null
    }
  }
}
```

## 🎨 Frontend Integration Guide

### Setting Up API Client

#### 1. Create API Configuration

```javascript
// src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

#### 2. Create Axios Instance (Recommended)

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Authentication Implementation

#### Register/Login

```javascript
// src/services/authService.js
import api from './api';

export const authService = {
  // Register new user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      // Token is set in cookie automatically
      // Optionally store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Logout user
  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
```

#### React Component Example

```jsx
// src/components/Login.jsx
import { useState } from 'react';
import { authService } from '../services/authService';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(formData);
      // Redirect to dashboard or home
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Team Management Implementation

```javascript
// src/services/teamService.js
import api from './api';

export const teamService = {
  // Create team
  async createTeam(teamData) {
    const response = await api.post('/teams', teamData);
    return response.data;
  },

  // Get all teams
  async getTeams() {
    const response = await api.get('/teams');
    return response.data;
  },

  // Get single team
  async getTeam(teamId) {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  },

  // Update team
  async updateTeam(teamId, teamData) {
    const response = await api.put(`/teams/${teamId}`, teamData);
    return response.data;
  },

  // Delete team
  async deleteTeam(teamId) {
    const response = await api.delete(`/teams/${teamId}`);
    return response.data;
  },

  // Add members
  async addMembers(teamId, members) {
    const response = await api.post(`/teams/${teamId}/members`, { members });
    return response.data;
  },

  // Get team members
  async getMembers(teamId) {
    const response = await api.get(`/teams/${teamId}/members`);
    return response.data;
  },

  // Update member
  async updateMember(teamId, memberId, memberData) {
    const response = await api.put(
      `/teams/${teamId}/members/${memberId}`,
      memberData
    );
    return response.data;
  },

  // Delete member
  async deleteMember(teamId, memberId) {
    const response = await api.delete(`/teams/${teamId}/members/${memberId}`);
    return response.data;
  },
};
```

### Project Management Implementation

```javascript
// src/services/projectService.js
import api from './api';

export const projectService = {
  async createProject(projectData) {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  async getProjects() {
    const response = await api.get('/projects');
    return response.data;
  },

  async getProject(projectId) {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  async updateProject(projectId, projectData) {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  },

  async deleteProject(projectId) {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },
};
```

### Task Management Implementation

```javascript
// src/services/taskService.js
import api from './api';

export const taskService = {
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  async getTasks(filters = {}) {
    const params = new URLSearchParams();
    if (filters.project) params.append('project', filters.project);
    if (filters.member) params.append('member', filters.member);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.status) params.append('status', filters.status);

    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  async getProjectTasks(projectId, filters = {}) {
    const params = new URLSearchParams();
    if (filters.member) params.append('member', filters.member);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.status) params.append('status', filters.status);

    const response = await api.get(
      `/tasks/project/${projectId}?${params.toString()}`
    );
    return response.data;
  },

  async getTask(taskId) {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  async updateTask(taskId, taskData) {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  async deleteTask(taskId) {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },
};
```

### Dashboard Implementation

```javascript
// src/services/dashboardService.js
import api from './api';

export const dashboardService = {
  async getDashboard(filters = {}) {
    const params = new URLSearchParams();
    if (filters.teamId) params.append('teamId', filters.teamId);
    if (filters.projectId) params.append('projectId', filters.projectId);

    const response = await api.get(`/dashboard?${params.toString()}`);
    return response.data;
  },
};
```

#### React Dashboard Component Example

```jsx
// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    teamId: '',
    projectId: '',
  });

  useEffect(() => {
    loadDashboard();
  }, [filters]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const result = await dashboardService.getDashboard(filters);
      setData(result.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <p>{data.totalProjects}</p>
        </div>
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{data.totalTasks}</p>
        </div>
      </div>

      <div className="team-summary">
        <h2>Team Workload</h2>
        {data.teamSummary.map((member) => (
          <div
            key={member.memberId}
            className={member.overloaded ? 'member overloaded' : 'member'}
          >
            <h4>{member.memberName}</h4>
            <p>Role: {member.memberRole}</p>
            <p>Tasks: {member.currentTasks} / {member.capacity}</p>
            {member.overloaded && <span className="badge">Overloaded</span>}
          </div>
        ))}
      </div>

      <div className="recent-activity">
        <h2>Recent Reassignments</h2>
        {data.recentReassignments.map((log) => (
          <div key={log.id} className="activity-item">
            <p>{log.message}</p>
            <small>{new Date(log.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Activity Log Implementation

```javascript
// src/services/activityLogService.js
import api from './api';

export const activityLogService = {
  async createLog(logData) {
    const response = await api.post('/activity-log', logData);
    return response.data;
  },

  async getLogs(filters = {}) {
    const params = new URLSearchParams();
    if (filters.teamId) params.append('teamId', filters.teamId);
    if (filters.projectId) params.append('projectId', filters.projectId);
    if (filters.taskId) params.append('taskId', filters.taskId);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/activity-log?${params.toString()}`);
    return response.data;
  },

  async getLog(logId) {
    const response = await api.get(`/activity-log/${logId}`);
    return response.data;
  },
};
```

### Error Handling Best Practices

```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Invalid request';
      case 401:
        return 'Please login to continue';
      case 403:
        return 'You do not have permission to perform this action';
      case 404:
        return 'Resource not found';
      case 409:
        return data.message || 'Conflict error';
      case 500:
        return 'Server error. Please try again later';
      default:
        return data.message || 'Something went wrong';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};
```

### State Management with React Context

```jsx
// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    setUser(result.data.user);
    return result;
  };

  const register = async (userData) => {
    const result = await authService.register(userData);
    setUser(result.data.user);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Protected Route Component

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

## 🗄 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  teams: [ObjectId], // References to Team
  createdAt: Date,
  updatedAt: Date
}
```

### Team Collection
```javascript
{
  _id: ObjectId,
  name: String,
  owner: ObjectId, // Reference to User
  members: [
    {
      _id: ObjectId,
      name: String,
      role: String,
      capacity: Number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Project Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  team: ObjectId, // Reference to Team
  owner: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  priority: String, // "Low" | "Medium" | "High"
  status: String, // "Pending" | "In Progress" | "Done"
  project: ObjectId, // Reference to Project
  team: ObjectId, // Reference to Team
  assignedMember: ObjectId, // Reference to Team Member
  owner: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityLog Collection
```javascript
{
  _id: ObjectId,
  taskId: ObjectId, // Reference to Task (optional)
  projectId: ObjectId, // Reference to Project (optional)
  teamId: ObjectId, // Reference to Team
  message: String,
  timestamp: Date,
  createdBy: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Md Humayun Kabir - L2 JavaScript Developer at Linno

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- Mongoose team for the ODM
- TypeScript team for type safety

---

**Built with ❤️ using Node.js, Express, TypeScript, and MongoDB**