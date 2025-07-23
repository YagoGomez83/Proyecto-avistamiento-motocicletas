// src/pages/AddBrandPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBrand } from '../api/apiService'; // Crearemos esta función

const AddBrandPage: React.FC = () => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook para redirigir al usuario

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Evita que la página se recargue
    setIsSubmitting(true);
    setError(null);

    try {
      await createBrand({ name });
      alert('¡Marca creada exitosamente!');
      navigate('/'); // Redirige a la página principal después de crear
    } catch (err) {
      setError('Error al crear la marca. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Añadir Nueva Marca</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Nombre de la Marca
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Marca'}
          </button>
          <button type="button" onClick={() => navigate('/')} className="text-gray-600">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrandPage;