import toast from 'react-hot-toast';

/**
 * Hook personalizado para manejar notificaciones Toast en toda la aplicación.
 * Centraliza el uso de react-hot-toast y proporciona funciones consistentes
 * para mostrar mensajes de éxito y error.
 */
export const useNotifier = () => {
  /**
   * Muestra una notificación de éxito
   * @param message - El mensaje a mostrar
   */
  const notifySuccess = (message: string) => {
    toast.success(message);
  };

  /**
   * Muestra una notificación de error
   * @param message - El mensaje de error a mostrar
   */
  const notifyError = (message: string) => {
    toast.error(message);
  };

  /**
   * Muestra una notificación informativa
   * @param message - El mensaje informativo a mostrar
   */
  const notifyInfo = (message: string) => {
    toast(message, {
      icon: 'ℹ️',
    });
  };

  /**
   * Muestra una notificación de advertencia
   * @param message - El mensaje de advertencia a mostrar
   */
  const notifyWarning = (message: string) => {
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
      },
    });
  };

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
  };
};
