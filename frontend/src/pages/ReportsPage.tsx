import React, { useState, useMemo } from 'react';
import { 
  useGetReportByCamera, 
  useGetReportByBrand, 
  useGetReportByEngineDisplacement 
} from '../hooks/useReportQueries';
import { BarChart, DoughnutChart, PieChart } from '../components/charts';
import ReportFilters, { type DateFilters } from '../components/ReportFilters';
import { 
  prepareChartDataForCamera, 
  prepareChartDataForBrand, 
  prepareChartDataForEngineDisplacement,
  getTotalSightings,
  formatDateForAPI,
  getDefaultStartDate,
  getDefaultEndDate
} from '../utils/reportUtils';
import type { ReportFilters as APIReportFilters } from '../api/apiService';
import toast from 'react-hot-toast';

// Componente de loading spinner
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Cargando reportes...</span>
  </div>
);

// Componente de error
const ErrorMessage: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="flex items-center">
      <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="flex-1">
        <h3 className="text-red-800 font-semibold">Error al cargar los reportes</h3>
        <p className="text-red-700 text-sm mt-1">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
      >
        Reintentar
      </button>
    </div>
  </div>
);

const ReportsPage: React.FC = () => {
  // Estado para los filtros de fecha
  const [dateFilters, setDateFilters] = useState<DateFilters>({
    startDate: formatDateForAPI(getDefaultStartDate()),
    endDate: formatDateForAPI(getDefaultEndDate()),
  });

  // Estado para los filtros aplicados (para controlar cuándo hacer las consultas)
  const [appliedFilters, setAppliedFilters] = useState<APIReportFilters>({
    startDate: formatDateForAPI(getDefaultStartDate()),
    endDate: formatDateForAPI(getDefaultEndDate()),
  });

  // Obtener datos de los reportes usando los hooks con filtros
  const { 
    data: cameraData, 
    isLoading: cameraLoading, 
    error: cameraError,
    refetch: refetchCamera
  } = useGetReportByCamera(appliedFilters);

  const { 
    data: brandData, 
    isLoading: brandLoading, 
    error: brandError,
    refetch: refetchBrand
  } = useGetReportByBrand(appliedFilters);

  const { 
    data: displacementData, 
    isLoading: displacementLoading, 
    error: displacementError,
    refetch: refetchDisplacement
  } = useGetReportByEngineDisplacement(appliedFilters);

  // Estado de carga general
  const isLoading = cameraLoading || brandLoading || displacementLoading;

  // Estado de error general
  const hasError = cameraError || brandError || displacementError;
  const errorMessage = cameraError?.message || brandError?.message || displacementError?.message || 'Error desconocido';

  // Función para reintentar todas las consultas
  const handleRetry = () => {
    refetchCamera();
    refetchBrand();
    refetchDisplacement();
  };

  // Función para aplicar filtros
  const handleApplyFilters = () => {
    const filters: APIReportFilters = {};
    
    if (dateFilters.startDate) {
      filters.startDate = dateFilters.startDate;
    }
    if (dateFilters.endDate) {
      filters.endDate = dateFilters.endDate;
    }

    setAppliedFilters(filters);
    toast.success('Filtros aplicados correctamente');
  };

  // Preparar datos para los gráficos
  const chartData = useMemo(() => {
    return {
      camera: cameraData ? prepareChartDataForCamera(cameraData) : null,
      brand: brandData ? prepareChartDataForBrand(brandData) : null,
      displacement: displacementData ? prepareChartDataForEngineDisplacement(displacementData) : null,
    };
  }, [cameraData, brandData, displacementData]);

  // Calcular estadísticas totales
  const totalStats = useMemo(() => {
    const cameraTotal = cameraData ? getTotalSightings(cameraData) : 0;
    const brandTotal = brandData ? getTotalSightings(brandData) : 0;
    const displacementTotal = displacementData ? getTotalSightings(displacementData) : 0;

    return {
      cameras: cameraData?.length || 0,
      brands: brandData?.length || 0,
      displacements: displacementData?.length || 0,
      totalSightings: Math.max(cameraTotal, brandTotal, displacementTotal), // Debería ser el mismo en todos
    };
  }, [cameraData, brandData, displacementData]);

  const handleExport = (type: 'image' | 'csv', chartType: string) => {
    toast.success(`Exportando ${chartType} como ${type.toUpperCase()}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reportes y Estadísticas
            </h1>
            <p className="text-lg text-gray-600">
              Análisis de datos de avistamientos de motocicletas
            </p>
          </div>
        </div>

        {/* Filtros */}
        <ReportFilters
          filters={dateFilters}
          onFiltersChange={setDateFilters}
          onApplyFilters={handleApplyFilters}
          isLoading={isLoading}
        />

        {/* Content */}
        <div className="space-y-8">
          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <LoadingSpinner />
            </div>
          )}

          {/* Error State */}
          {hasError && !isLoading && (
            <ErrorMessage message={errorMessage} onRetry={handleRetry} />
          )}

          {/* Success State - Show Charts */}
          {!isLoading && !hasError && (
            <>
              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {chartData.camera && (
                  <BarChart
                    data={chartData.camera}
                    title="📹 Avistamientos por Cámara"
                    onExportImage={() => handleExport('image', 'cámaras')}
                    onExportCSV={() => handleExport('csv', 'cámaras')}
                  />
                )}
                
                {chartData.brand && (
                  <DoughnutChart
                    data={chartData.brand}
                    title="🏍️ Avistamientos por Marca"
                    onExportImage={() => handleExport('image', 'marcas')}
                    onExportCSV={() => handleExport('csv', 'marcas')}
                  />
                )}
                
                {chartData.displacement && (
                  <PieChart
                    data={chartData.displacement}
                    title="⚙️ Avistamientos por Cilindrada"
                    onExportImage={() => handleExport('image', 'cilindradas')}
                    onExportCSV={() => handleExport('csv', 'cilindradas')}
                  />
                )}
              </div>

              {/* Summary Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Resumen de Datos</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {totalStats.cameras}
                    </div>
                    <div className="text-sm text-blue-800">Cámaras Activas</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {totalStats.brands}
                    </div>
                    <div className="text-sm text-green-800">Marcas Detectadas</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {totalStats.displacements}
                    </div>
                    <div className="text-sm text-purple-800">Cilindradas Registradas</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {totalStats.totalSightings}
                    </div>
                    <div className="text-sm text-orange-800">Total Avistamientos</div>
                  </div>
                </div>
                
                {/* Información del rango de fechas aplicado */}
                {appliedFilters.startDate || appliedFilters.endDate ? (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Período analizado:</span>
                      {appliedFilters.startDate && appliedFilters.endDate ? (
                        ` ${appliedFilters.startDate} al ${appliedFilters.endDate}`
                      ) : appliedFilters.startDate ? (
                        ` desde ${appliedFilters.startDate}`
                      ) : (
                        ` hasta ${appliedFilters.endDate}`
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Mostrando:</span> Todos los avistamientos registrados
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
