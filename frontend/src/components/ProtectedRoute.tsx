import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente guardia para rutas protegidas.
 * Requiere que el usuario esté autenticado para acceder.
 * Elimina condiciones de carrera centralizando la lógica de redirección.
 */
const ProtectedRoute = () => {
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

  // Si el usuario está autenticado, permitir acceso a rutas protegidas
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Si el usuario NO está autenticado, redirigir al login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
