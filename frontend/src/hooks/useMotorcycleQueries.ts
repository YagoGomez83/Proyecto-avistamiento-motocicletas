import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMotorcycles, 
  getMotorcycleById, 
  createMotorcycle, 
  updateMotorcycle, 
  deleteMotorcycle,
  type GetAllMotorcyclesParams,
  type CreateMotorcyclePayload,
  type CreateMotorcycleResponse,
  type UpdateMotorcyclePayload
} from '../api/apiService';
import type { MotorcycleDto } from '../types/motorcycle';

/**
 * Hook para obtener todas las motocicletas usando TanStack Query
 * @param params - Parámetros de filtrado para las motocicletas
 * @returns Query object con los datos de las motocicletas, estado de carga, errores, etc.
 */
export const useGetMotorcycles = (params: GetAllMotorcyclesParams = {}) => {
  return useQuery<MotorcycleDto[], Error>({
    queryKey: ['motorcycles', params],
    queryFn: () => getMotorcycles(params),
  });
};

/**
 * Hook para obtener una motocicleta específica por ID usando TanStack Query
 * @param motorcycleId - ID de la motocicleta a obtener
 * @returns Query object con los datos de la motocicleta específica
 */
export const useGetMotorcycleById = (motorcycleId: string) => {
  return useQuery<MotorcycleDto, Error>({
    queryKey: ['motorcycles', motorcycleId],
    queryFn: () => getMotorcycleById(motorcycleId),
    enabled: !!motorcycleId, // Solo ejecutar si tenemos motorcycleId
  });
};

/**
 * Hook para crear una nueva motocicleta usando TanStack Query
 * @returns Mutation object con funciones y estados para crear una motocicleta
 */
export const useCreateMotorcycle = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateMotorcycleResponse, Error, CreateMotorcyclePayload>({
    mutationFn: createMotorcycle,
    onSuccess: () => {
      // Invalidar y refrescar la lista de motocicletas cuando la creación sea exitosa
      queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
    },
  });
};

/**
 * Hook para actualizar una motocicleta existente usando TanStack Query
 * @returns Mutation object con funciones y estados para actualizar una motocicleta
 */
export const useUpdateMotorcycle = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; payload: UpdateMotorcyclePayload }>({
    mutationFn: ({ id, payload }) => updateMotorcycle(id, payload),
    onSuccess: (_, variables) => {
      // Invalidar y refrescar la lista de motocicletas
      queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
      // También invalidar la motocicleta específica
      queryClient.invalidateQueries({ queryKey: ['motorcycles', variables.id] });
    },
  });
};

/**
 * Hook para eliminar una motocicleta usando TanStack Query
 * @returns Mutation object con funciones y estados para eliminar una motocicleta
 */
export const useDeleteMotorcycle = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteMotorcycle,
    onSuccess: (_, motorcycleId) => {
      // Invalidar y refrescar la lista de motocicletas cuando la eliminación sea exitosa
      queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
      // Remover la motocicleta específica de la cache
      queryClient.removeQueries({ queryKey: ['motorcycles', motorcycleId] });
    },
  });
};
