import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';
import { PublicLayout } from '../layouts/PublicLayout';

// Auth Pages
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

// App Pages
import { Dashboard } from '../pages/Dashboard';
import { Teams } from '../pages/Teams';
import { TeamDetail } from '../pages/TeamDetail';
import { Projects } from '../pages/Projects';
import { ProjectDetail } from '../pages/ProjectDetail';
import { Tasks } from '../pages/Tasks';
import { CreateTask } from '../pages/CreateTask';
import { EditTask } from '../pages/EditTask';
import { KanbanBoard } from '../pages/KanbanBoard';
import { ActivityLog } from '../pages/ActivityLog';
import { NotFound } from '../pages/NotFound';

export const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
  
  // Protected routes
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/teams',
        element: <Teams />,
      },
      {
        path: '/teams/:teamId',
        element: <TeamDetail />,
      },
      {
        path: '/projects',
        element: <Projects />,
      },
      {
        path: '/projects/:projectId',
        element: <ProjectDetail />,
      },
      {
        path: '/projects/:projectId/tasks/kanban',
        element: <KanbanBoard />,
      },
      {
        path: '/tasks',
        element: <Tasks />,
      },
      {
        path: '/tasks/create',
        element: <CreateTask />,
      },
      {
        path: '/tasks/:taskId/edit',
        element: <EditTask />,
      },
      {
        path: '/activity-log',
        element: <ActivityLog />,
      },
    ],
  },

  // 404 route
  {
    path: '*',
    element: <NotFound />,
  },
]);
