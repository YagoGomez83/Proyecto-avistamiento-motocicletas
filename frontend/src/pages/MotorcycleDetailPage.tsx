// src/pages/MotorcycleDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMotorcycleById } from '../api/apiService';
import type { MotorcycleDto } from '../types/motorcycle';
import toast from 'react-hot-toast';

const MotorcycleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [motorcycle, setMotorcycle] = useState<MotorcycleDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMotorcycle = async () => {
      if (!id) {
        setError('ID de motocicleta no válido');
        setIsLoading(false);
        return;
      }

      try {
        const motorcycleData = await getMotorcycleById(id);
        setMotorcycle(motorcycleData);
      } catch (error) {
        console.error('Error loading motorcycle:', error);
        setError('Error al cargar los detalles de la motocicleta');
        toast.error('No se pudo cargar la motocicleta');
      } finally {
        setIsLoading(false);
      }
    };

    loadMotorcycle();
  }, [id]);

  const handleBack = () => {
    navigate('/motorcycles');
  };

  const handleEdit = () => {
    // Navegar a página de edición (implementar más tarde si es necesario)
    toast('Función de edición por implementar', {
      icon: 'ℹ️'
    });
  };

  // Función para formatear el cilindraje
  const formatDisplacement = (displacement?: number) => {
    if (!displacement) return 'No especificado';
    return `${displacement}cc`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !motorcycle) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Motocicleta no encontrada'}
            </h1>
            <p className="text-gray-600 mb-6">
              No se pudieron cargar los detalles de la motocicleta solicitada.
            </p>
            <button
              onClick={handleBack}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Volver a Motocicletas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              Detalles de Motocicleta
            </h1>
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              ← Volver
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Información Básica
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Marca</label>
                  <p className="text-lg text-gray-900">{motorcycle.brandName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Modelo</label>
                  <p className="text-lg text-gray-900">
                    {motorcycle.model || 'No especificado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Placa</label>
                  <p className="text-lg text-gray-900 font-mono">
                    {motorcycle.licensePlate || 'No especificada'}
                  </p>
                </div>
              </div>
            </div>

            {/* Especificaciones técnicas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Especificaciones
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Año</label>
                  <p className="text-lg text-gray-900">
                    {motorcycle.year || 'No especificado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Cilindraje</label>
                  <p className="text-lg text-gray-900">
                    {formatDisplacement(motorcycle.displacement)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Color</label>
                  <p className="text-lg text-gray-900">
                    {motorcycle.color || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ID de la motocicleta (para debug/admin) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Información del Sistema
            </h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block font-medium text-gray-600">ID de Motocicleta</label>
                  <p className="text-gray-800 font-mono">{motorcycle.id}</p>
                </div>
                <div>
                  <label className="block font-medium text-gray-600">ID de Marca</label>
                  <p className="text-gray-800 font-mono">{motorcycle.brandId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleEdit}
              className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
            >
              Editar Motocicleta
            </button>
            
            <button
              onClick={handleBack}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Volver a Lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorcycleDetailPage;
