import React, { useState, useEffect, useCallback } from 'react';
import { getRecentSightings } from '../../api/apiService';
import type { SightingDto } from '../../types/motorcycle';
import SightingListItem from './SightingListItem';

interface SightingListProps {
  limit?: number;
  showTitle?: boolean;
  onRefresh?: () => void;
}

const SightingList: React.FC<SightingListProps> = ({ 
  limit = 10, 
  showTitle = true,
  onRefresh 
}) => {
  const [sightings, setSightings] = useState<SightingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSightings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecentSightings(limit);
      setSightings(data);
    } catch (err) {
      setError('Error al cargar los avistamientos');
      console.error('Error fetching sightings:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchSightings();
  }, [fetchSightings]);

  const handleRefresh = () => {
    fetchSightings();
    onRefresh?.();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {showTitle && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Avistamientos Recientes</h2>
          </div>
        )}
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="flex space-x-4">
                <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        {showTitle && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Avistamientos Recientes</h2>
            <button
              onClick={handleRefresh}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Reintentar
            </button>
          </div>
        )}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Avistamientos Recientes
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({sightings.length} {sightings.length === 1 ? 'registro' : 'registros'})
            </span>
          </h2>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Actualizar</span>
          </button>
        </div>
      )}

      {sightings.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay avistamientos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza registrando tu primer avistamiento de motocicleta.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sightings.map((sighting) => (
            <SightingListItem key={sighting.id} sighting={sighting} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SightingList;
