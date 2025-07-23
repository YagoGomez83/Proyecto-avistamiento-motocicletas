import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Importa el Layout Principal y todas las Páginas
import App from './App.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import BrandsPage from './pages/BrandsPage.tsx';
import CamerasPage from './pages/CamerasPage.tsx';
import SightingDetailPage from './pages/SightingDetailPage.tsx';
import MotorcyclesPage from './pages/MotorcyclesPage.tsx';
import AddMotorcyclePage from './pages/AddMotorcyclePage.tsx';
import MotorcycleDetailPage from './pages/MotorcycleDetailPage.tsx';
import MotorcycleSightingsPage from './pages/MotorcycleSightingsPage.tsx';
import ReportsPage from './pages/ReportsPage.tsx';

import './index.css';

// Crear instancia del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
    },
  },
});

// Definimos la estructura de rutas de toda la aplicación
const router = createBrowserRouter([
  {
    // Rutas públicas (envueltas por PublicRoute)
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    // Rutas protegidas (envueltas por ProtectedRoute)
    element: <ProtectedRoute />,
    children: [
      {
        // La ruta raíz '/' usa el layout App y renderiza las páginas hijas
        path: '/',
        element: <App />,
        children: [
          {
            index: true, // La ruta '/' por defecto renderiza HomePage
            element: <HomePage />,
          },
          {
            path: 'brands',
            element: <BrandsPage />,
          },
          {
            path: 'cameras',
            element: <CamerasPage />,
          },
          {
            path: 'motorcycles',
            element: <MotorcyclesPage />,
          },
          {
            path: 'motorcycles/new',
            element: <AddMotorcyclePage />,
          },
          {
            path: 'motorcycles/:id',
            element: <MotorcycleDetailPage />,
          },
          {
            path: 'motorcycles/:motorcycleId/sightings',
            element: <MotorcycleSightingsPage />,
          },
          {
            path: 'sightings/:sightingId',
            element: <SightingDetailPage />,
          },
          {
            path: 'reports',
            element: <ReportsPage />,
          },
          // ...aquí irían otras páginas protegidas que usan el layout App
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);