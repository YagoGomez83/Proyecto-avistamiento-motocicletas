import React, { useState } from 'react';
import { useGetBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '../hooks/useBrandQueries';
import toast from 'react-hot-toast';
import type { BrandDto } from '../types/motorcycle';

const BrandsPage: React.FC = () => {
  // Estados locales para formularios
  const [name, setName] = useState('');
  const [editingBrand, setEditingBrand] = useState<BrandDto | null>(null);
  const [editName, setEditName] = useState('');

  // Hooks de TanStack Query
  const { data: brands = [], isLoading: isLoadingBrands, isError, error, refetch } = useGetBrands();
  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();
  const deleteBrandMutation = useDeleteBrand();

  // Funciones para el modal de edición
  const handleOpenEditModal = (brand: BrandDto) => {
    setEditingBrand(brand);
    setEditName(brand.name);
  };

  const handleCloseEditModal = () => {
    setEditingBrand(null);
    setEditName('');
  };

  // Función para manejar la creación de marca
  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('El nombre de la marca es requerido');
      return;
    }

    createBrandMutation.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          toast.success('Marca creada exitosamente');
          setName(''); // Limpiar el formulario
        },
        onError: (error) => {
          toast.error(`Error al crear la marca: ${error.message}`);
        },
      }
    );
  };

  // Función para manejar la actualización de marca
  const handleUpdateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingBrand || !editName.trim()) {
      toast.error('El nombre de la marca es requerido');
      return;
    }

    updateBrandMutation.mutate(
      { 
        id: editingBrand.id, 
        payload: { id: editingBrand.id, name: editName.trim() } 
      },
      {
        onSuccess: () => {
          toast.success('Marca actualizada exitosamente');
          handleCloseEditModal();
        },
        onError: (error) => {
          toast.error(`Error al actualizar la marca: ${error.message}`);
        },
      }
    );
  };

  // Función para manejar la eliminación de marca
  const handleDeleteBrand = (brand: BrandDto) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la marca "${brand.name}"?`)) {
      return;
    }

    deleteBrandMutation.mutate(brand.id, {
      onSuccess: () => {
        toast.success('Marca eliminada exitosamente');
      },
      onError: (error) => {
        toast.error(`Error al eliminar la marca: ${error.message}`);
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Marcas</h1>
      
      {/* Formulario para añadir nueva marca */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Añadir Nueva Marca</h2>
        
        <form onSubmit={handleCreateBrand} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Marca *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Honda, Yamaha, Kawasaki..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={createBrandMutation.isPending}
              maxLength={100}
            />
          </div>

          <button
            type="submit"
            disabled={createBrandMutation.isPending || !name.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {createBrandMutation.isPending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </span>
            ) : (
              'Crear Marca'
            )}
          </button>
        </form>
      </div>

      {/* Lista de marcas existentes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Marcas Existentes</h2>
          <button
            onClick={() => refetch()}
            disabled={isLoadingBrands}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoadingBrands ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>

        {/* Estado de carga */}
        {isLoadingBrands && (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-gray-600">Cargando marcas...</span>
          </div>
        )}

        {/* Estado de error */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-8 text-red-500">
            <svg className="h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-2">Error al cargar las marcas</p>
            <p className="text-gray-600 mb-4">
              {error?.message || 'Ha ocurrido un error inesperado'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Lista de marcas */}
        {!isLoadingBrands && !isError && (
          <>
            {brands.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                </svg>
                <p className="text-lg font-medium text-gray-900 mb-2">No hay marcas registradas</p>
                <p className="text-gray-600">Añade la primera marca usando el formulario de arriba.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de Creación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {brands.map((brand) => (
                      <tr key={brand.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {new Date(brand.createdAtUtc).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500 font-mono">{brand.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenEditModal(brand)}
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(brand)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de edición */}
      {editingBrand && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Marca</h3>
            
            <form onSubmit={handleUpdateBrand} className="space-y-4">
              <div>
                <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Marca *
                </label>
                <input
                  type="text"
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Ej: Honda, Yamaha, Kawasaki..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={updateBrandMutation.isPending}
                  maxLength={100}
                  autoFocus
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={updateBrandMutation.isPending || !editName.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {updateBrandMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Actualizando...
                    </span>
                  ) : (
                    'Actualizar'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={updateBrandMutation.isPending}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandsPage;
