import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Componente guardia para rutas públicas (login, register).
 * Previene que usuarios autenticados accedan a páginas de autenticación.
 * Elimina condiciones de carrera centralizando la lógica de redirección.
 */
const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mientras se verifica el estado de autenticación, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si el usuario YA está autenticado, redirigir a la página principal
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario NO está autenticado, permitir acceso a rutas públicas
  return <Outlet />;
};

export default PublicRoute;
