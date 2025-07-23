// src/hooks/useReportQueries.ts
import { useQuery } from '@tanstack/react-query';
import { 
  getReportByCamera, 
  getReportByBrand, 
  getReportByEngineDisplacement,
  type ReportFilters
} from '../api/apiService';
import type { 
  SightingCountByCamera, 
  SightingCountByBrand, 
  SightingCountByEngineDisplacement 
} from '../types/reportTypes';

/**
 * Hook para obtener el reporte de avistamientos por cámara
 */
export const useGetReportByCamera = (filters?: ReportFilters) => {
  return useQuery<SightingCountByCamera[], Error>({
    queryKey: ['reports', 'byCamera', filters],
    queryFn: () => getReportByCamera(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para obtener el reporte de avistamientos por marca
 */
export const useGetReportByBrand = (filters?: ReportFilters) => {
  return useQuery<SightingCountByBrand[], Error>({
    queryKey: ['reports', 'byBrand', filters],
    queryFn: () => getReportByBrand(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para obtener el reporte de avistamientos por cilindrada
 */
export const useGetReportByEngineDisplacement = (filters?: ReportFilters) => {
  return useQuery<SightingCountByEngineDisplacement[], Error>({
    queryKey: ['reports', 'byEngineDisplacement', filters],
    queryFn: () => getReportByEngineDisplacement(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
