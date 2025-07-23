// src/utils/reportUtils.ts
// Funciones utilitarias para trabajar con los datos de reportes

import type { 
  SightingCountByCamera, 
  SightingCountByBrand, 
  SightingCountByEngineDisplacement
} from '../types/reportTypes';
import type { BarChartData, DoughnutChartData, PieChartData } from '../components/charts';

/**
 * Prepara los datos de reportes por cámara para gráficos de barras
 */
export const prepareChartDataForCamera = (data: SightingCountByCamera[]): BarChartData => {
  return {
    labels: data.map(item => item.cameraName),
    datasets: [
      {
        label: 'Avistamientos',
        data: data.map(item => item.count),
        backgroundColor: [
          '#3B82F6', // blue-500
          '#EF4444', // red-500
          '#10B981', // emerald-500
          '#F59E0B', // amber-500
          '#8B5CF6', // violet-500
          '#06B6D4', // cyan-500
        ],
        borderColor: [
          '#2563EB', // blue-600
          '#DC2626', // red-600
          '#059669', // emerald-600
          '#D97706', // amber-600
          '#7C3AED', // violet-600
          '#0891B2', // cyan-600
        ],
        borderWidth: 2,
      },
    ],
  };
};

/**
 * Prepara los datos de reportes por marca para gráficos tipo doughnut
 */
export const prepareChartDataForBrand = (data: SightingCountByBrand[]): DoughnutChartData => {
  return {
    labels: data.map(item => item.brandName),
    datasets: [
      {
        label: 'Avistamientos',
        data: data.map(item => item.count),
        backgroundColor: [
          '#EF4444', // red-500
          '#3B82F6', // blue-500
          '#10B981', // emerald-500
          '#F59E0B', // amber-500
          '#8B5CF6', // violet-500
          '#06B6D4', // cyan-500
          '#EC4899', // pink-500
          '#84CC16', // lime-500
        ],
        borderColor: ['#ffffff'],
        borderWidth: 3,
      },
    ],
  };
};

/**
 * Prepara los datos de reportes por cilindrada para gráficos de pie
 */
export const prepareChartDataForEngineDisplacement = (data: SightingCountByEngineDisplacement[]): PieChartData => {
  return {
    labels: data.map(item => item.displacementDisplay),
    datasets: [
      {
        label: 'Avistamientos',
        data: data.map(item => item.count),
        backgroundColor: [
          '#10B981', // emerald-500
          '#8B5CF6', // violet-500
          '#F59E0B', // amber-500
          '#EF4444', // red-500
          '#3B82F6', // blue-500
          '#06B6D4', // cyan-500
          '#EC4899', // pink-500
          '#84CC16', // lime-500
          '#F97316', // orange-500
          '#6366F1', // indigo-500
        ],
        borderColor: ['#ffffff'],
        borderWidth: 3,
      },
    ],
  };
};

/**
 * Función utilitaria para formatear fechas
 */
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

/**
 * Función utilitaria para obtener una fecha por defecto (7 días atrás)
 */
export const getDefaultStartDate = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};

/**
 * Función utilitaria para obtener la fecha actual
 */
export const getDefaultEndDate = (): Date => {
  return new Date();
};

/**
 * Verifica si un rango de fechas es válido
 */
export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate <= endDate;
};

/**
 * Obtiene el número total de avistamientos de cualquier tipo de reporte
 */
export const getTotalSightings = (
  data: SightingCountByCamera[] | SightingCountByBrand[] | SightingCountByEngineDisplacement[]
): number => {
  return data.reduce((total, item) => total + item.count, 0);
};
