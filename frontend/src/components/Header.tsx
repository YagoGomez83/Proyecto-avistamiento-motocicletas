import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Header.css';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <h1>Motorcycle Manager</h1>
          </Link>
        </div>
        
        <nav className="header-nav">
          {isAuthenticated ? (
            <div className="user-section">
              <span className="welcome-message">
                Bienvenido, {user?.fullName || user?.username}
              </span>
              <button onClick={handleLogout} className="logout-button">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="auth-section">
              <Link to="/register" className="register-link">
                Crear Cuenta
              </Link>
              <Link to="/login" className="login-link">
                Iniciar Sesión
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
