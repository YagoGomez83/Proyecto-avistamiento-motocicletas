import React from 'react';
import { useSightingDetail } from '../hooks/useSightingDetail';
import AddSightingModal from '../features/sightings/AddSightingModal';

const SightingDetailPage: React.FC = () => {
  const {
    // Estados principales
    sighting,
    loading,
    error,
    
    // Estados de modales
    showDeleteModal,
    deleting,
    showEditModal,
    
    // Funciones de manejo
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleEditClick,
    handleEditClose,
    handleSightingUpdated,
    handleGoBack,
    
    // Funciones utilitarias
    formatDateTime,
    getDisplacementText
  } = useSightingDetail();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando avistamiento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleGoBack}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!sighting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No se encontró el avistamiento</p>
          <button
            onClick={handleGoBack}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={handleGoBack}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a la lista
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Detalles del Avistamiento</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleEditClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button
                onClick={handleDeleteClick}
                disabled={deleting}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Imagen */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={sighting.imageUrl || '/api/placeholder/400/300'}
                alt="Imagen del avistamiento"
                className="w-full h-96 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/400/300';
                }}
              />
            </div>
          </div>

          {/* Información */}
          <div className="space-y-6">
            {/* Información básica */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Avistamiento</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Fecha y Hora:</span>
                  <p className="text-gray-900">{formatDateTime(sighting.sightingTimeUtc)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Cámara:</span>
                  <p className="text-gray-900">{sighting.cameraName}</p>
                </div>
                {sighting.notes && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Notas:</span>
                    <p className="text-gray-900">{sighting.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Información de la motocicleta */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de la Motocicleta</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Matrícula:</span>
                  <p className="text-gray-900 font-mono">
                    {sighting.motorcycleLicensePlate || 'No especificada'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Marca:</span>
                  <p className="text-gray-900">{sighting.motorcycleBrandName}</p>
                </div>
                {sighting.motorcycleModel && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Modelo:</span>
                    <p className="text-gray-900">{sighting.motorcycleModel}</p>
                  </div>
                )}
                {sighting.motorcycleYear && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Año:</span>
                    <p className="text-gray-900">{sighting.motorcycleYear}</p>
                  </div>
                )}
                {sighting.motorcycleColor && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Color:</span>
                    <p className="text-gray-900">{sighting.motorcycleColor}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-500">Cilindrada:</span>
                  <p className="text-gray-900">{getDisplacementText(sighting.motorcycleDisplacement)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirmar Eliminación</h2>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar este avistamiento? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edición */}
        {showEditModal && sighting && (
          <AddSightingModal
            isOpen={showEditModal}
            onClose={handleEditClose}
            onSightingCreated={handleSightingUpdated}
            sightingToEdit={sighting}
          />
        )}
      </div>
    </div>
  );
};

export default SightingDetailPage;
