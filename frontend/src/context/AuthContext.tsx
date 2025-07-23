import React, { createContext, useState, useEffect, useContext } from 'react';

// Interfaz para el usuario
interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  lastName: string;
  fullName: string;
}

// Estado consolidado para evitar race conditions
interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

// Interfaz para el contexto de autenticación
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Crear y exportar el contexto de autenticación
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Función para decodificar el token JWT (simple, sin validación de seguridad)
const decodeJWT = (token: string): User | null => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    return {
      id: decodedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      username: decodedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email: decodedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      name: decodedPayload['name'],
      lastName: decodedPayload['lastName'],
      fullName: decodedPayload['fullName']
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Estado consolidado para evitar race conditions
interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
    isLoading: true
  });

  // Cargar token del localStorage al inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('%c[AuthContext] Inicializando autenticación...', 'color: blue;');
        const savedToken = localStorage.getItem('authToken');
        
        if (savedToken) {
          const decodedUser = decodeJWT(savedToken);
          if (decodedUser) {
            console.log('%c[AuthContext] Token válido encontrado en localStorage', 'color: green;');
            // Actualizamos todo el estado de una vez para evitar race conditions
            setAuthState({
              token: savedToken,
              user: decodedUser,
              isLoading: false
            });
            return;
          } else {
            // Token inválido, remover del localStorage
            console.log('%c[AuthContext] Token inválido encontrado, removiendo...', 'color: orange;');
            localStorage.removeItem('authToken');
          }
        }
        
        // No hay token o es inválido
        console.log('%c[AuthContext] No hay token válido, usuario no autenticado', 'color: gray;');
        setAuthState({
          token: null,
          user: null,
          isLoading: false
        });
      } catch (error) {
        console.error('%c[AuthContext] Error inicializando autenticación:', 'color: red;', error);
        localStorage.removeItem('authToken');
        setAuthState({
          token: null,
          user: null,
          isLoading: false
        });
      }
    };

    initializeAuth();
  }, []);

  const login = (newToken: string) => {
    console.log('%c[AuthContext] Procesando login...', 'color: blue;');
    const decodedUser = decodeJWT(newToken);
    
    if (decodedUser) {
      // Actualizamos todo el estado de una vez
      setAuthState({
        token: newToken,
        user: decodedUser,
        isLoading: false
      });
      localStorage.setItem('authToken', newToken);
      console.log('%c[AuthContext] ¡Login exitoso! Usuario autenticado:', 'color: green;', decodedUser.username);
    } else {
      console.error('%c[AuthContext] Error: Token inválido recibido durante login', 'color: red;');
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const logout = () => {
    console.log('%c[AuthContext] Procesando logout...', 'color: blue;');
    setAuthState({
      token: null,
      user: null,
      isLoading: false
    });
    localStorage.removeItem('authToken');
    console.log('%c[AuthContext] Logout completado', 'color: gray;');
  };

  // Calculamos isAuthenticated de forma derivada y estable
  const isAuthenticated = !!authState.token && !!authState.user && !authState.isLoading;
  
  // Log para debuggear el estado
  console.log('%c[AuthContext] Estado actual:', 'color: purple;', {
    isAuthenticated,
    isLoading: authState.isLoading,
    hasToken: !!authState.token,
    hasUser: !!authState.user,
    username: authState.user?.username || 'none'
  });

  const value: AuthContextType = {
    user: authState.user,
    token: authState.token,
    isAuthenticated,
    isLoading: authState.isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
