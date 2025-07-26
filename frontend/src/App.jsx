// App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Home from './pages/home.jsx';
import Messages from './pages/messages.jsx';
import AppLayout from './components/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Search from './pages/search.jsx';
import Profile from './pages/profile.jsx';
import EditProfile from './components/EditProfile.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/',
    element: <ProtectedRoute />,  // All protected routes go here
    children: [
      {
        element: <AppLayout />,     // Common layout for authenticated pages
        children: [
          {
            path: 'home',
            element: <Home />
          },
          {
            path: 'messages',
            element: <Messages />
          },
          {
            path: 'search',
            element: <Search />
          },
          {
            path: 'profile/:userName',
            element: <Profile  />
          },
          {
            path: 'edit-profile',
            element: <EditProfile />
          }
        ]
      }
    ]
  }
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
