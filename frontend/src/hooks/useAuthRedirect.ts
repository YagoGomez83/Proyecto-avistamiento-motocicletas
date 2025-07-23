import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Hook personalizado para manejar redirecciones automáticas después del login.
 * Evita bucles de redirección y maneja la sincronización de estado.
 */
export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Solo procesamos redirecciones cuando el estado de auth se ha estabilizado
    if (!isLoading) {
      const currentPath = location.pathname;
      
      console.log(`%c[useAuthRedirect] Evaluando redirección:`, 'color: purple;', {
        currentPath,
        isAuthenticated,
        isLoading
      });

      // Si el usuario está autenticado y está en una ruta pública, redirigir al dashboard
      if (isAuthenticated && (currentPath === '/login' || currentPath === '/register')) {
        console.log('%c[useAuthRedirect] 🔄 Redirigiendo usuario autenticado al dashboard', 'color: blue;');
        navigate('/', { replace: true });
        return;
      }

      // Si el usuario no está autenticado y está en una ruta protegida, redirigir al login
      if (!isAuthenticated && currentPath !== '/login' && currentPath !== '/register') {
        console.log('%c[useAuthRedirect] 🔄 Redirigiendo usuario no autenticado al login', 'color: orange;');
        navigate('/login', { replace: true });
        return;
      }

      console.log('%c[useAuthRedirect] ✅ No se requiere redirección', 'color: green;');
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  return { isLoading, isAuthenticated };
};
