// src/types/reportTypes.ts

/**
 * Tipo que representa las cilindradas de motores disponibles
 * Coincide con EngineDisplacement del backend
 */
export type EngineDisplacement = 50 | 110 | 125 | 150 | 200 | 250 | 300 | 500 | 650 | 750 | 1000 | 1200;

/**
 * Constante con todos los valores de cilindrada disponibles
 */
export const ENGINE_DISPLACEMENTS: EngineDisplacement[] = [50, 110, 125, 150, 200, 250, 300, 500, 650, 750, 1000, 1200];

/**
 * Mapa para convertir valores numéricos a labels descriptivos
 */
export const ENGINE_DISPLACEMENT_LABELS: Record<EngineDisplacement, string> = {
  50: 'Cc50',
  110: 'Cc110',
  125: 'Cc125',
  150: 'Cc150',
  200: 'Cc200',
  250: 'Cc250',
  300: 'Cc300',
  500: 'Cc500',
  650: 'Cc650',
  750: 'Cc750',
  1000: 'Cc1000',
  1200: 'Cc1200'
};

/**
 * DTO que representa el conteo de avistamientos agrupados por cámara.
 * Corresponde a SightingCountByCameraDto del backend.
 */
export interface SightingCountByCamera {
  /**
   * Nombre de la cámara
   */
  cameraName: string;
  
  /**
   * Número total de avistamientos registrados por esta cámara
   */
  count: number;
}

/**
 * DTO que representa el conteo de avistamientos agrupados por marca de motocicleta.
 * Corresponde a SightingCountByBrandDto del backend.
 */
export interface SightingCountByBrand {
  /**
   * Nombre de la marca de la motocicleta
   */
  brandName: string;
  
  /**
   * Número total de avistamientos de motocicletas de esta marca
   */
  count: number;
}

/**
 * DTO que representa el conteo de avistamientos agrupados por cilindrada del motor.
 * Corresponde a SightingCountByEngineDisplacementDto del backend.
 */
export interface SightingCountByEngineDisplacement {
  /**
   * Cilindrada del motor de la motocicleta
   */
  engineDisplacement: EngineDisplacement;
  
  /**
   * Número total de avistamientos de motocicletas con esta cilindrada
   */
  count: number;
  
  /**
   * Representación en string de la cilindrada para facilitar la visualización
   */
  displacementDisplay: string;
}

/**
 * Tipos para las respuestas de la API de reportes
 */
export type SightingReportsByCameraResponse = SightingCountByCamera[];
export type SightingReportsByBrandResponse = SightingCountByBrand[];
export type SightingReportsByEngineDisplacementResponse = SightingCountByEngineDisplacement[];

/**
 * Función utilitaria para obtener la representación en string de una cilindrada
 */
export const getDisplacementDisplay = (displacement: EngineDisplacement): string => {
  return `${displacement}cc`;
};

/**
 * Función utilitaria para convertir el valor numérico a EngineDisplacement
 */
export const getEngineDisplacementFromValue = (value: number): EngineDisplacement | undefined => {
  return ENGINE_DISPLACEMENTS.includes(value as EngineDisplacement) 
    ? value as EngineDisplacement 
    : undefined;
};

/**
 * Obtener todas las cilindradas disponibles como array
 */
export const getAllEngineDisplacements = (): EngineDisplacement[] => {
  return ENGINE_DISPLACEMENTS;
};
