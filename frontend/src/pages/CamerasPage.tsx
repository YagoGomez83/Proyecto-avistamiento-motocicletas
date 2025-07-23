import React, { useState } from 'react';
import { useGetCameras, useCreateCamera, useUpdateCamera, useDeleteCamera } from '../hooks/useCameraQueries';
import CameraForm from '../components/CameraForm';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';
import type { CameraDto } from '../types/motorcycle';
import type { CreateCameraPayload } from '../api/apiService';

const CamerasPage: React.FC = () => {
  // Estados locales
  const [editingCamera, setEditingCamera] = useState<CameraDto | null>(null);
  const [deletingCamera, setDeletingCamera] = useState<CameraDto | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hooks de TanStack Query
  const { data: cameras = [], isLoading: isLoadingCameras, error: camerasError, refetch: loadCameras } = useGetCameras();
  const createCameraMutation = useCreateCamera();
  const updateCameraMutation = useUpdateCamera();
  const deleteCameraMutation = useDeleteCamera();

  // Estados derivados
  const isEditMode = !!editingCamera;
  const isSubmitting = createCameraMutation.isPending || updateCameraMutation.isPending;
  const submitError = createCameraMutation.error?.message || updateCameraMutation.error?.message || null;
  const isDeleting = deleteCameraMutation.isPending;

  // Función para recargar cámaras
  const handleRefreshCameras = () => {
    loadCameras();
  };

  // Funciones de manejo
  const handleCreateCamera = async (cameraData: CreateCameraPayload) => {
    return new Promise<void>((resolve, reject) => {
      createCameraMutation.mutate(cameraData, {
        onSuccess: () => {
          setSuccessMessage('Cámara creada exitosamente');
          toast.success('Cámara creada exitosamente');
          resolve();
        },
        onError: (error) => {
          toast.error(`Error al crear la cámara: ${error.message}`);
          reject(error);
        }
      });
    });
  };

  const handleUpdateCamera = async (cameraData: CreateCameraPayload) => {
    if (!editingCamera) return;
    
    updateCameraMutation.mutate(
      { id: editingCamera.id, payload: cameraData },
      {
        onSuccess: () => {
          setSuccessMessage('Cámara actualizada exitosamente');
          setEditingCamera(null);
          toast.success('Cámara actualizada exitosamente');
        },
        onError: (error) => {
          toast.error(`Error al actualizar la cámara: ${error.message}`);
        }
      }
    );
  };

  const handleEditClick = (camera: CameraDto) => {
    setEditingCamera(camera);
  };

  const handleCancelEdit = () => {
    setEditingCamera(null);
  };

  const handleDeleteClick = (camera: CameraDto) => {
    setDeletingCamera(camera);
  };

  const handleConfirmDelete = () => {
    if (!deletingCamera) return;
    
    deleteCameraMutation.mutate(deletingCamera.id, {
      onSuccess: () => {
        setSuccessMessage('Cámara eliminada exitosamente');
        setDeletingCamera(null);
        toast.success('Cámara eliminada exitosamente');
      },
      onError: (error) => {
        toast.error(`Error al eliminar la cámara: ${error.message}`);
      }
    });
  };

  const handleCancelDelete = () => {
    setDeletingCamera(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestión de Cámaras
            </h1>
            <p className="text-lg text-gray-600">
              Administra y configura las cámaras del sistema de vigilancia
            </p>
          </div>
        </div>

        {/* Formulario para Crear/Editar Cámara */}
        <div className="mb-8">
          <CameraForm
            onSubmit={isEditMode ? handleUpdateCamera : handleCreateCamera}
            initialData={editingCamera}
            isEditMode={isEditMode}
            isSubmitting={isSubmitting}
            submitError={submitError}
            successMessage={successMessage}
            onCancel={isEditMode ? handleCancelEdit : undefined}
          />
        </div>
        {/* Lista de Cámaras Existentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Cámaras Existentes
            </h2>
            <button
              onClick={handleRefreshCameras}
              disabled={isLoadingCameras}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {isLoadingCameras ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>

          {/* Estado de carga */}
          {isLoadingCameras && (
            <div className="flex items-center justify-center p-8 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
              Cargando cámaras...
            </div>
          )}

          {/* Error de carga */}
          {camerasError && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md mb-4">
              {camerasError.message}
              <button
                type="button"
                onClick={handleRefreshCameras}
                className="ml-2 text-red-800 underline hover:no-underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Lista de cámaras */}
          {!isLoadingCameras && !camerasError && (
            <>
              {cameras.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 mb-2">No hay cámaras registradas</p>
                  <p className="text-gray-600">Utiliza el formulario de arriba para añadir tu primera cámara.</p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ubicación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha de Creación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cameras.map((camera) => (
                        <tr key={camera.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {camera.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {camera.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {camera.location ? (
                              <div>
                                <div>{camera.location.street}</div>
                                <div className="text-gray-500">
                                  {camera.location.city}
                                  {camera.location.state && `, ${camera.location.state}`}
                                  {camera.location.country && ` - ${camera.location.country}`}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Sin ubicación</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(camera.createdAtUtc).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditClick(camera)}
                                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteClick(camera)}
                                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal de Confirmación para Eliminación */}
        <ConfirmationModal
          isOpen={!!deletingCamera}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Eliminar Cámara"
          message={`¿Estás seguro de que quieres eliminar la cámara "${deletingCamera?.name}"? Esta acción no se puede deshacer.`}
          confirmButtonText="Eliminar"
          cancelButtonText="Cancelar"
          isDestructive={true}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default CamerasPage;
