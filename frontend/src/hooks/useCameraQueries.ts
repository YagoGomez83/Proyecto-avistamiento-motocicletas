import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCameras, createCamera, updateCamera, deleteCamera, type CreateCameraPayload, type CreateCameraResponse } from '../api/apiService';
import type { CameraDto } from '../types/motorcycle';

/**
 * Hook para obtener todas las cámaras usando TanStack Query
 * @returns Query object con los datos de las cámaras, estado de carga, errores, etc.
 */
export const useGetCameras = () => {
  return useQuery<CameraDto[], Error>({
    queryKey: ['cameras'],
    queryFn: getCameras,
  });
};

/**
 * Hook para crear una nueva cámara usando TanStack Query
 * @returns Mutation object con funciones y estados para crear una cámara
 */
export const useCreateCamera = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCameraResponse, Error, CreateCameraPayload>({
    mutationFn: createCamera,
    onSuccess: () => {
      // Invalidar y refrescar la lista de cámaras cuando la creación sea exitosa
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
  });
};

/**
 * Hook para actualizar una cámara existente usando TanStack Query
 * @returns Mutation object con funciones y estados para actualizar una cámara
 */
export const useUpdateCamera = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; payload: CreateCameraPayload }>({
    mutationFn: ({ id, payload }) => updateCamera(id, payload),
    onSuccess: () => {
      // Invalidar y refrescar la lista de cámaras cuando la actualización sea exitosa
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
  });
};

/**
 * Hook para eliminar una cámara usando TanStack Query
 * @returns Mutation object con funciones y estados para eliminar una cámara
 */
export const useDeleteCamera = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteCamera,
    onSuccess: () => {
      // Invalidar y refrescar la lista de cámaras cuando la eliminación sea exitosa
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
  });
};

/**
 * Hook para obtener una cámara específica por ID usando TanStack Query
 * @param cameraId - ID de la cámara a obtener
 * @returns Query object con los datos de la cámara específica
 */
export const useGetCameraById = (cameraId: string) => {
  const { data: cameras = [] } = useGetCameras();

  return useQuery<CameraDto | undefined, Error>({
    queryKey: ['cameras', cameraId],
    queryFn: () => {
      // Como no tenemos un endpoint específico para obtener por ID,
      // filtramos de la lista completa de cámaras
      const camera = cameras.find(c => c.id === cameraId);
      return Promise.resolve(camera);
    },
    enabled: !!cameraId && cameras.length > 0, // Solo ejecutar si tenemos cameraId y cámaras cargadas
  });
};
