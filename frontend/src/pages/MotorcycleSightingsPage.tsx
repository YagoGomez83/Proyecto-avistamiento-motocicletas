import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSightingsForMotorcycle, getMotorcycleById } from '../api/apiService';
import type { SightingDto, MotorcycleDto } from '../types/motorcycle';
import SightingImage from '../components/SightingImage';

const MotorcycleSightingsPage: React.FC = () => {
  const { motorcycleId } = useParams<{ motorcycleId: string }>();
  const navigate = useNavigate();
  
  const [motorcycle, setMotorcycle] = useState<MotorcycleDto | null>(null);
  const [sightings, setSightings] = useState<SightingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!motorcycleId) {
      navigate('/motorcycles');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // Cargar datos de la motocicleta y sus avistamientos en paralelo
        const [motorcycleData, sightingsData] = await Promise.all([
          getMotorcycleById(motorcycleId),
          getSightingsForMotorcycle(motorcycleId)
        ]);
        
        setMotorcycle(motorcycleData);
        setSightings(sightingsData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error al cargar los datos. La motocicleta podría no existir.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [motorcycleId, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error || !motorcycle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-4">
            {error || 'Motocicleta no encontrada'}
          </div>
          <Link
            to="/motorcycles"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Volver a Motocicletas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm breadcrumbs mb-2">
              <Link to="/motorcycles" className="text-blue-500 hover:text-blue-700">
                Motocicletas
              </Link>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-700">Avistamientos</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-800">
              Avistamientos de la Motocicleta
            </h1>
            <div className="mt-2 text-lg text-gray-600">
              <span className="font-semibold">
                {motorcycle.licensePlate || 'Sin matrícula'}
              </span>
              {motorcycle.brandName && (
                <span> - {motorcycle.brandName}</span>
              )}
              {motorcycle.model && (
                <span> {motorcycle.model}</span>
              )}
              {motorcycle.year && (
                <span> ({motorcycle.year})</span>
              )}
            </div>
          </div>
          
          <Link
            to="/motorcycles"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Volver
          </Link>
        </div>
      </div>

      {/* Información adicional de la motocicleta */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Detalles de la Motocicleta
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Marca:</span>
            <p className="text-gray-800">{motorcycle.brandName}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Modelo:</span>
            <p className="text-gray-800">{motorcycle.model || 'N/A'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Año:</span>
            <p className="text-gray-800">{motorcycle.year || 'N/A'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Cilindrada:</span>
            <p className="text-gray-800">
              {motorcycle.displacement ? `${motorcycle.displacement}cc` : 'N/A'}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Color:</span>
            <p className="text-gray-800">{motorcycle.color || 'N/A'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Total Avistamientos:</span>
            <p className="text-gray-800 font-semibold">{sightings.length}</p>
          </div>
        </div>
      </div>

      {/* Lista de avistamientos */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Historial de Avistamientos
          </h2>
        </div>
        
        {sightings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No se han registrado avistamientos para esta motocicleta</p>
            <p className="mt-2">Los avistamientos aparecerán aquí cuando sean detectados por las cámaras</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sightings.map((sighting) => (
              <div key={sighting.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {sighting.cameraName}
                      </h3>
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {formatDate(sighting.sightingTimeUtc)}
                      </span>
                    </div>
                    
                    {sighting.notes && (
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Notas:</span> {sighting.notes}
                      </p>
                    )}
                    
                    <div className="text-sm text-gray-500">
                      ID del avistamiento: {sighting.id}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <SightingImage
                      imageUrl={sighting.imageUrl}
                      alt={`Avistamiento ${formatDate(sighting.sightingTimeUtc)}`}
                      className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                      fallbackClassName="bg-gray-100 flex items-center justify-center"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MotorcycleSightingsPage;
