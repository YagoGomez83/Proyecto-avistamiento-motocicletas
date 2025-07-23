import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGetMotorcycles, useDeleteMotorcycle } from '../hooks/useMotorcycleQueries';
import { useGetBrands } from '../hooks/useBrandQueries';
import ConfirmationModal from '../components/ConfirmationModal';
import EditMotorcycleModal from '../components/EditMotorcycleModal';
import { useNotifier } from '../hooks/useNotifier';
import type { MotorcycleDto, BrandDto } from '../types/motorcycle';

const MotorcyclesPage: React.FC = () => {
  // Estados locales para filtros y modales
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<MotorcycleDto | null>(null);
  
  // Ref para el timeout de búsqueda
  const searchTimeoutRef = useRef<number | null>(null);
  
  // Hooks de TanStack Query
  const { data: brands = [] } = useGetBrands();
  const { 
    data: motorcycles = [], 
    isLoading: loading, 
    refetch: refetchMotorcycles 
  } = useGetMotorcycles({
    searchTerm: searchTerm || undefined,
    brandId: selectedBrand || undefined,
    pageSize: 50
  });
  
  const deleteMotorcycleMutation = useDeleteMotorcycle();
  const { notifySuccess, notifyError } = useNotifier();

  const handleSearch = () => {
    refetchMotorcycles();
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Búsqueda en tiempo real si el usuario para de escribir
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      refetchMotorcycles();
    }, 500);
  };

  const handleBrandFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    // El refetch se hará automáticamente por el cambio en selectedBrand
  };

  const handleEditClick = (motorcycle: MotorcycleDto) => {
    setSelectedMotorcycle(motorcycle);
    setShowEditModal(true);
  };

  const handleDeleteClick = (motorcycle: MotorcycleDto) => {
    setSelectedMotorcycle(motorcycle);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMotorcycle) return;

    try {
      await deleteMotorcycleMutation.mutateAsync(selectedMotorcycle.id);
      notifySuccess('Motocicleta eliminada exitosamente');
      setShowDeleteModal(false);
      setSelectedMotorcycle(null);
    } catch (error) {
      console.error('Error deleting motorcycle:', error);
      notifyError('Error al eliminar la motocicleta');
    }
  };

  const handleMotorcycleUpdated = () => {
    // TanStack Query se encarga de la invalidación automática
    notifySuccess('Motocicleta actualizada exitosamente');
    setShowEditModal(false);
    setSelectedMotorcycle(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedMotorcycle(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedMotorcycle(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Motocicletas</h1>
        <Link
          to="/motorcycles/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Agregar Nueva Motocicleta
        </Link>
      </div>

      {/* Filtros de búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar (matrícula, modelo, marca, color)
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Buscar motocicletas..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por marca
            </label>
            <select
              id="brand"
              value={selectedBrand}
              onChange={handleBrandFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las marcas</option>
              {brands.map((brand: BrandDto) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de motocicletas */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Cargando motocicletas...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {motorcycles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron motocicletas
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matrícula
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modelo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Año
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cilindrada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Color
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {motorcycles.map((motorcycle: MotorcycleDto) => (
                    <tr key={motorcycle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {motorcycle.licensePlate || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {motorcycle.brandName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {motorcycle.model || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {motorcycle.year || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {motorcycle.displacement ? `${motorcycle.displacement}cc` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {motorcycle.color || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditClick(motorcycle)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteClick(motorcycle)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Eliminar
                        </button>
                        <Link
                          to={`/motorcycles/${motorcycle.id}/sightings`}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          Ver Avistamientos
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que quieres eliminar la motocicleta ${selectedMotorcycle?.licensePlate || 'seleccionada'}?`}
        confirmButtonText="Eliminar"
        cancelButtonText="Cancelar"
        isDestructive
      />

      {/* Modal de edición */}
      {showEditModal && selectedMotorcycle && (
        <EditMotorcycleModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          motorcycle={selectedMotorcycle}
          brands={brands}
          onSuccess={handleMotorcycleUpdated}
        />
      )}
    </div>
  );
};

export default MotorcyclesPage;
