import React, { useState, useEffect } from 'react';
import type { CreateCameraPayload } from '../api/apiService';
import type { CameraDto } from '../types/motorcycle';

interface CameraFormProps {
  onSubmit: (payload: CreateCameraPayload) => Promise<void>;
  initialData?: CameraDto | null;
  isEditMode?: boolean;
  isSubmitting?: boolean;
  submitError?: string | null;
  successMessage?: string | null;
  onCancel?: () => void;
}

const CameraForm: React.FC<CameraFormProps> = ({
  onSubmit,
  initialData,
  isEditMode = false,
  isSubmitting = false,
  submitError,
  successMessage,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    country: 'Argentina' // Valor por defecto
  });

  // Efecto para cargar datos iniciales en modo edición
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name || '',
        street: initialData.location?.street || '',
        city: initialData.location?.city || '',
        state: initialData.location?.state || '',
        country: initialData.location?.country || 'Argentina'
      });
    } else if (!isEditMode) {
      // Limpiar formulario en modo creación
      setFormData({
        name: '',
        street: '',
        city: '',
        state: '',
        country: 'Argentina'
      });
    }
  }, [isEditMode, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.name.trim()) {
      return;
    }

    try {
      // Preparar payload para la API
      const payload: CreateCameraPayload = {
        name: formData.name.trim(),
      };

      // Solo incluir location si al menos street o city están llenos
      if (formData.street.trim() || formData.city.trim()) {
        payload.location = {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim()
        };
      }

      await onSubmit(payload);
      
      // Si es modo creación, limpiar formulario
      if (!isEditMode) {
        setFormData({
          name: '',
          street: '',
          city: '',
          state: '',
          country: 'Argentina'
        });
      }

    } catch {
      // El error es manejado por el componente padre
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditMode ? 'Editar Cámara' : 'Añadir Nueva Cámara'}
        </h2>
        {isEditMode && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
      
      {/* Mensajes de estado */}
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {submitError}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre de la cámara */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Cámara *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Cámara Principal - Entrada Norte"
            disabled={isSubmitting}
          />
        </div>

        {/* Información de ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
              Calle (opcional)
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Av. Libertador 1234"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad (opcional)
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Buenos Aires"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              Estado/Provincia (opcional)
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: CABA"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              País (opcional)
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Argentina"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditMode ? 'Actualizando...' : 'Creando...'}
              </span>
            ) : (
              isEditMode ? 'Actualizar Cámara' : 'Crear Cámara'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CameraForm;
