import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMotorcycle, getBrands } from '../api/apiService';
import type { BrandDto } from '../types/motorcycle';
import type { CreateMotorcyclePayload } from '../api/apiService';

// Valores del enum EngineDisplacement desde el backend
const ENGINE_DISPLACEMENT_OPTIONS = [
  { value: 50, label: '50cc' },
  { value: 110, label: '110cc' },
  { value: 125, label: '125cc' },
  { value: 150, label: '150cc' },
  { value: 200, label: '200cc' },
  { value: 250, label: '250cc' },
  { value: 300, label: '300cc' },
  { value: 500, label: '500cc' },
  { value: 650, label: '650cc' },
  { value: 750, label: '750cc' },
  { value: 1000, label: '1000cc' },
  { value: 1200, label: '1200cc' },
];

const AddMotorcyclePage: React.FC = () => {
  const [formData, setFormData] = useState<CreateMotorcyclePayload>({
    brandId: '',
    licensePlate: '',
    model: '',
    year: undefined,
    displacement: undefined,
    color: '',
  });
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const navigate = useNavigate();

  // Cargar las marcas al montar el componente
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brandsData = await getBrands();
        setBrands(brandsData);
      } catch (err) {
        console.error('Error loading brands:', err);
        setError('Error al cargar las marcas');
      } finally {
        setIsLoadingBrands(false);
      }
    };

    loadBrands();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'displacement' 
        ? (value ? parseInt(value) : undefined)
        : value || undefined
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validar que al menos se haya seleccionado una marca
      if (!formData.brandId) {
        throw new Error('Debe seleccionar una marca');
      }

      // Preparar los datos para enviar (limpiar campos vacíos)
      const payload: CreateMotorcyclePayload = {
        brandId: formData.brandId,
        licensePlate: formData.licensePlate || undefined,
        model: formData.model || undefined,
        year: formData.year || undefined,
        displacement: formData.displacement || undefined,
        color: formData.color || undefined,
      };

      await createMotorcycle(payload);
      
      // Mostrar mensaje de éxito y redirigir
      alert('¡Motocicleta creada exitosamente!');
      navigate('/motorcycles');
    } catch (err) {
      console.error('Error creating motorcycle:', err);
      setError(err instanceof Error ? err.message : 'Error al crear la motocicleta. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingBrands) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <p className="text-center">Cargando marcas...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Añadir Nueva Motocicleta</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Marca */}
        <div className="mb-4">
          <label htmlFor="brandId" className="block text-gray-700 font-bold mb-2">
            Marca <span className="text-red-500">*</span>
          </label>
          <select
            id="brandId"
            name="brandId"
            value={formData.brandId}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Selecciona una marca</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Matrícula */}
        <div className="mb-4">
          <label htmlFor="licensePlate" className="block text-gray-700 font-bold mb-2">
            Matrícula
          </label>
          <input
            type="text"
            id="licensePlate"
            name="licensePlate"
            value={formData.licensePlate || ''}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ej: ABC123"
            maxLength={20}
          />
        </div>

        {/* Modelo */}
        <div className="mb-4">
          <label htmlFor="model" className="block text-gray-700 font-bold mb-2">
            Modelo
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model || ''}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ej: Ninja 650"
            maxLength={100}
          />
        </div>

        {/* Año y Cilindrada en la misma fila */}
        <div className="flex gap-4">
          {/* Año */}
          <div className="flex-1">
            <label htmlFor="year" className="block text-gray-700 font-bold mb-2">
              Año
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ej: 2023"
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>

          {/* Cilindrada */}
          <div className="flex-1">
            <label htmlFor="displacement" className="block text-gray-700 font-bold mb-2">
              Cilindrada
            </label>
            <select
              id="displacement"
              name="displacement"
              value={formData.displacement || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Selecciona cilindrada</option>
              {ENGINE_DISPLACEMENT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Color */}
        <div className="mb-4">
          <label htmlFor="color" className="block text-gray-700 font-bold mb-2">
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color || ''}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ej: Rojo"
            maxLength={50}
          />
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Botones */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Motocicleta'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/motorcycles')} 
            className="text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMotorcyclePage;
