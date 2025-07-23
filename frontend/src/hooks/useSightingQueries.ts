import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getRecentSightings,
  getSightingById,
  createSighting,
  createSightingWithImage,
  updateSighting,
  deleteSighting,
  type CreateSightingWithImagePayload,
  type UpdateSightingPayload
} from '../api/apiService';
import type { SightingDto, CreateSightingDto } from '../types/motorcycle';

/**
 * Hook para obtener avistamientos recientes usando TanStack Query
 * @param limit - Número máximo de avistamientos a obtener
 * @returns Query object con los datos de los avistamientos recientes
 */
export const useGetRecentSightings = (limit: number = 10) => {
  return useQuery<SightingDto[], Error>({
    queryKey: ['sightings', 'recent', limit],
    queryFn: () => getRecentSightings(limit),
  });
};

/**
 * Hook para obtener un avistamiento específico por ID usando TanStack Query
 * @param sightingId - ID del avistamiento a obtener
 * @returns Query object con los datos del avistamiento específico
 */
export const useGetSightingById = (sightingId: string) => {
  return useQuery<SightingDto, Error>({
    queryKey: ['sightings', sightingId],
    queryFn: () => getSightingById(sightingId),
    enabled: !!sightingId, // Solo ejecutar si tenemos sightingId
  });
};

/**
 * Hook para crear un nuevo avistamiento usando TanStack Query
 * @returns Mutation object con funciones y estados para crear un avistamiento
 */
export const useCreateSighting = () => {
  const queryClient = useQueryClient();

  return useMutation<SightingDto, Error, CreateSightingDto>({
    mutationFn: createSighting,
    onSuccess: () => {
      // Invalidar y refrescar los avistamientos cuando la creación sea exitosa
      queryClient.invalidateQueries({ queryKey: ['sightings'] });
    },
  });
};

/**
 * Hook para crear un nuevo avistamiento con imagen usando TanStack Query
 * @returns Mutation object con funciones y estados para crear un avistamiento con imagen
 */
export const useCreateSightingWithImage = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, Error, CreateSightingWithImagePayload>({
    mutationFn: createSightingWithImage,
    onSuccess: () => {
      // Invalidar y refrescar los avistamientos cuando la creación sea exitosa
      queryClient.invalidateQueries({ queryKey: ['sightings'] });
    },
  });
};

/**
 * Hook para actualizar un avistamiento existente usando TanStack Query
 * @returns Mutation object con funciones y estados para actualizar un avistamiento
 */
export const useUpdateSighting = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; payload: UpdateSightingPayload }>({
    mutationFn: ({ id, payload }) => updateSighting(id, payload),
    onSuccess: (_, variables) => {
      // Invalidar y refrescar los avistamientos
      queryClient.invalidateQueries({ queryKey: ['sightings'] });
      // También invalidar el avistamiento específico
      queryClient.invalidateQueries({ queryKey: ['sightings', variables.id] });
    },
  });
};

/**
 * Hook para eliminar un avistamiento usando TanStack Query
 * @returns Mutation object con funciones y estados para eliminar un avistamiento
 */
export const useDeleteSighting = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteSighting,
    onSuccess: (_, sightingId) => {
      // Invalidar y refrescar los avistamientos cuando la eliminación sea exitosa
      queryClient.invalidateQueries({ queryKey: ['sightings'] });
      // Remover el avistamiento específico de la cache
      queryClient.removeQueries({ queryKey: ['sightings', sightingId] });
    },
  });
};

/**
 * Hook para obtener avistamientos de una motocicleta específica usando TanStack Query
 * @param motorcycleId - ID de la motocicleta
 * @returns Query object con los avistamientos de la motocicleta
 */
export const useGetSightingsByMotorcycle = (motorcycleId: string) => {
  return useQuery<SightingDto[], Error>({
    queryKey: ['sightings', 'motorcycle', motorcycleId],
    queryFn: async () => {
      // Como no tenemos un endpoint específico, obtenemos todos los recientes
      // y filtramos por motorcycleId (esto podría optimizarse con un endpoint específico)
      const allSightings = await getRecentSightings(100);
      return allSightings.filter(sighting => sighting.motorcycleId === motorcycleId);
    },
    enabled: !!motorcycleId, // Solo ejecutar si tenemos motorcycleId
  });
};
