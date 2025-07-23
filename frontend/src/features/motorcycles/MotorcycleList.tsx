import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMotorcycles } from '../../api/apiService';
import type { GetAllMotorcyclesParams } from '../../api/apiService';
import type { MotorcycleDto } from '../../types/motorcycle';
import { useDebounce } from '../../hooks/useDebounce'; 

const MotorcycleList: React.FC = () => {
  const [motorcycles, setMotorcycles] = useState<MotorcycleDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los filtros y la paginación
  const [modelFilter, setModelFilter] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  // Hook de "debounce" para no llamar a la API en cada tecleo
  const debouncedModelFilter = useDebounce(modelFilter, 500);

  const fetchMotorcycles = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: GetAllMotorcyclesParams = {
        pageNumber,
        pageSize: 10,
        model: debouncedModelFilter,
      };
      const data = await getMotorcycles(params);
      setMotorcycles(data);
      setError(null);
    } catch {
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, debouncedModelFilter]); // Dependencias del useCallback

  useEffect(() => {
    fetchMotorcycles();
  }, [fetchMotorcycles]); // useEffect depende de la función memoizada

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Filtros</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrar por modelo..."
          value={modelFilter}
          onChange={(e) => setModelFilter(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
        />
      </div>

      {isLoading && <div>Cargando motocicletas...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      <ul className="space-y-2">
        {!isLoading && motorcycles.map((moto) => (
          <li key={moto.id} className="bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Link 
              to={`/motorcycles/${moto.id}`}
              className="block p-4 text-decoration-none"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-800">
                    {moto.brandName} {moto.model || 'Sin modelo'}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    {moto.licensePlate && (
                      <span className="font-mono">Placa: {moto.licensePlate}</span>
                    )}
                    {moto.year && (
                      <span className="ml-4">Año: {moto.year}</span>
                    )}
                    {moto.displacement && (
                      <span className="ml-4">Cilindraje: {moto.displacement}cc</span>
                    )}
                  </div>
                </div>
                <svg 
                  className="w-5 h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1 || isLoading}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="self-center">Página {pageNumber}</span>
        <button
          onClick={() => setPageNumber(prev => prev + 1)}
          disabled={isLoading}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default MotorcycleList;