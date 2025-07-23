import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBrands, createBrand, updateBrand, deleteBrand, type CreateBrandPayload } from '../api/apiService';
import type { BrandDto } from '../types/motorcycle';

/**
 * Hook para obtener todas las marcas usando TanStack Query
 * @returns Query object con los datos de las marcas, estado de carga, errores, etc.
 */
export const useGetBrands = () => {
  return useQuery<BrandDto[], Error>({
    queryKey: ['brands'],
    queryFn: getBrands,
  });
};

/**
 * Hook para crear una nueva marca usando TanStack Query
 * @returns Mutation object con funciones y estados para crear una marca
 */
export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<BrandDto, Error, CreateBrandPayload>({
    mutationFn: createBrand,
    onSuccess: () => {
      // Invalidar y refrescar la lista de marcas cuando la creación sea exitosa
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

/**
 * Hook para actualizar una marca existente usando TanStack Query
 * @returns Mutation object con funciones y estados para actualizar una marca
 */
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; payload: { id: string; name: string } }>({
    mutationFn: ({ id, payload }) => updateBrand(id, payload),
    onSuccess: () => {
      // Invalidar y refrescar la lista de marcas cuando la actualización sea exitosa
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

/**
 * Hook para eliminar una marca usando TanStack Query
 * @returns Mutation object con funciones y estados para eliminar una marca
 */
export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteBrand,
    onSuccess: () => {
      // Invalidar y refrescar la lista de marcas cuando la eliminación sea exitosa
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

/**
 * Hook para obtener una marca específica por ID usando TanStack Query
 * @param brandId - ID de la marca a obtener
 * @returns Query object con los datos de la marca específica
 */
export const useGetBrandById = (brandId: string) => {
  const { data: brands = [] } = useGetBrands();

  return useQuery<BrandDto | undefined, Error>({
    queryKey: ['brands', brandId],
    queryFn: () => {
      // Como no tenemos un endpoint específico para obtener por ID,
      // filtramos de la lista completa de marcas
      const brand = brands.find(b => b.id === brandId);
      return Promise.resolve(brand);
    },
    enabled: !!brandId && brands.length > 0, // Solo ejecutar si tenemos brandId y marcas cargadas
  });
};
