import React from 'react';
import { Link } from 'react-router-dom';
import type { SightingDto } from '../../types/motorcycle';

interface SightingListItemProps {
  sighting: SightingDto;
}

const SightingListItem: React.FC<SightingListItemProps> = ({ sighting }) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `Hace ${diffMins} minutos`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} horas`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <Link 
      to={`/sightings/${sighting.id}`}
      className="block bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-all duration-200 hover:shadow-lg hover:border-blue-300"
    >
      <div className="flex space-x-4">
        {/* Image */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={sighting.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Im00IDhzMC00IDQtNGg4YzQgMCA0IDQgNCA0djd2M2gtMlY5aC00VjBoLTJWOUg0djdIMnYtM1Y4eiI+PC9wYXRoPjwvc3ZnPg=='}
              alt={`Avistamiento de ${sighting.motorcycleLicensePlate || 'motocicleta'}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Im00IDhzMC00IDQtNGg4YzQgMCA0IDQgNCA0djd2M2gtMlY5aC00VjBoLTJWOUg0djdIMnYtM1Y4eiI+PC9wYXRoPjwvc3ZnPg==';
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Motorcycle Info */}
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {sighting.motorcycleLicensePlate || 'Sin matrícula'}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {sighting.motorcycleBrandName}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {sighting.motorcycleModel && sighting.motorcycleYear ? (
                  `${sighting.motorcycleModel} (${sighting.motorcycleYear})`
                ) : (
                  sighting.motorcycleModel || 'Modelo no especificado'
                )}
                {sighting.motorcycleColor && (
                  <span className="ml-2 text-gray-500">• {sighting.motorcycleColor}</span>
                )}
                {sighting.motorcycleDisplacement && (
                  <span className="ml-2 text-gray-500">• {sighting.motorcycleDisplacement}cc</span>
                )}
              </p>

              {/* Camera Info */}
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{sighting.cameraName}</span>
              </div>

              {/* Notes */}
              {sighting.notes && (
                <div className="mt-2">
                  <p className="text-sm text-gray-700 bg-yellow-50 px-3 py-2 rounded-lg border-l-4 border-yellow-400">
                    <span className="font-medium">Nota:</span> {sighting.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Time */}
            <div className="flex-shrink-0 text-right">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatDateTime(sighting.sightingTimeUtc)}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(sighting.sightingTimeUtc).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action indicator for clickable items */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-end text-sm text-blue-600">
          <span>Ver detalles</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default SightingListItem;
