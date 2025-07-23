import React, { useState, useEffect } from 'react';
import { getCameras, getBrands, findMotorcycleByLicensePlate, createMotorcycle, createSightingWithImage, updateSighting } from '../../api/apiService';
import type { CreateMotorcyclePayload, CreateSightingWithImagePayload, UpdateSightingPayload } from '../../api/apiService';
import type { CameraDto, BrandDto, MotorcycleDto, SightingDto } from '../../types/motorcycle';
import { useDebounce } from '../../hooks/useDebounce';
import { useNotifier } from '../../hooks/useNotifier';

// Importar la URL base para construir URLs absolutas de imágenes
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5167/api';

// Función helper para manejar URLs de imagen
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  // Si ya es una URL completa, la devolvemos tal como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Si es una ruta relativa, construimos la URL completa
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}/${imagePath}`;
};

interface AddSightingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSightingCreated: () => void;
  sightingToEdit?: SightingDto | null;
}

const AddSightingModal: React.FC<AddSightingModalProps> = ({ 
  isOpen, 
  onClose, 
  onSightingCreated, 
  sightingToEdit 
}) => {
  const { notifySuccess, notifyError } = useNotifier();

  // Estados para datos de API
  const [cameras, setCameras] = useState<CameraDto[]>([]);
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [foundMotorcycle, setFoundMotorcycle] = useState<MotorcycleDto | null>(null);
  
  // Determinar si estamos en modo edición
  const isEditMode = !!sightingToEdit;
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    cameraId: '',
    licensePlate: '',
    imageFile: null as File | null,
    newImageFile: null as File | null, // Para modo edición
    sightingTimeUtc: new Date().toISOString().slice(0, 16), // formato datetime-local
    notes: '',
    // Campos para nueva motocicleta
    brandId: '',
    model: '',
    year: new Date().getFullYear(),
    displacement: '',
    color: ''
  });

  // Estados de UI
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSearchingMotorcycle, setIsSearchingMotorcycle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewMotorcycleForm, setShowNewMotorcycleForm] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null); // Para modo edición

  // Debounce para búsqueda de motocicleta
  const debouncedLicensePlate = useDebounce(formData.licensePlate, 500);

  // Cargar datos iniciales al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Pre-rellenar formulario en modo edición
  useEffect(() => {
    if (isOpen && sightingToEdit) {
      setFormData(prev => ({
        ...prev,
        cameraId: sightingToEdit.cameraId,
        licensePlate: sightingToEdit.motorcycleLicensePlate || '',
        sightingTimeUtc: new Date(sightingToEdit.sightingTimeUtc).toISOString().slice(0, 16),
        notes: sightingToEdit.notes || ''
      }));
      
      // Simular motocicleta encontrada para modo edición
      setFoundMotorcycle({
        id: sightingToEdit.motorcycleId,
        brandId: '', // No tenemos este dato en SightingDto
        brandName: sightingToEdit.motorcycleBrandName,
        licensePlate: sightingToEdit.motorcycleLicensePlate || '',
        model: sightingToEdit.motorcycleModel || '',
        year: sightingToEdit.motorcycleYear || 0,
        displacement: sightingToEdit.motorcycleDisplacement || 0,
        color: sightingToEdit.motorcycleColor || ''
      });
      
      setShowNewMotorcycleForm(false);
    }
  }, [isOpen, sightingToEdit]);

  // Buscar motocicleta por matrícula (solo en modo crear)
  useEffect(() => {
    if (debouncedLicensePlate.trim() && isOpen && !sightingToEdit) {
      searchMotorcycleByLicensePlate(debouncedLicensePlate);
    } else if (!sightingToEdit) {
      setFoundMotorcycle(null);
      setShowNewMotorcycleForm(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLicensePlate, isOpen, sightingToEdit]);

  const loadInitialData = async () => {
    try {
      setIsLoadingData(true);
      
      const [camerasData, brandsData] = await Promise.all([
        getCameras(),
        getBrands()
      ]);

      setCameras(camerasData);
      setBrands(brandsData);
    } catch (err) {
      notifyError('Error al cargar los datos iniciales');
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const searchMotorcycleByLicensePlate = async (licensePlate: string) => {
    try {
      setIsSearchingMotorcycle(true);
      
      const motorcycle = await findMotorcycleByLicensePlate(licensePlate);
      
      if (motorcycle) {
        setFoundMotorcycle(motorcycle);
        setShowNewMotorcycleForm(false);
      } else {
        setFoundMotorcycle(null);
        setShowNewMotorcycleForm(true);
      }
    } catch (err) {
      notifyError('Error al buscar la motocicleta');
      console.error('Error searching motorcycle:', err);
    } finally {
      setIsSearchingMotorcycle(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño del archivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        notifyError('El archivo es demasiado grande. El tamaño máximo permitido es 10MB.');
        return;
      }

      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        notifyError('Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, GIF, BMP, WebP).');
        return;
      }
      
      if (isEditMode) {
        // En modo edición, usar newImageFile
        setFormData(prev => ({ ...prev, newImageFile: file }));
        
        // Crear preview de la nueva imagen
        const reader = new FileReader();
        reader.onload = (e) => {
          setNewImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // En modo crear, usar imageFile
        setFormData(prev => ({ ...prev, imageFile: file }));
        
        // Crear preview de la imagen
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.cameraId || !formData.licensePlate.trim()) {
      notifyError('Por favor, completa todos los campos obligatorios');
      return;
    }

    // En modo crear, validar que hay imagen
    if (!isEditMode && !formData.imageFile) {
      notifyError('Por favor, selecciona una imagen');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditMode && sightingToEdit) {
        // Modo edición: actualizar avistamiento existente
        const updatePayload: UpdateSightingPayload = {
          cameraId: formData.cameraId,
          sightingTimeUtc: new Date(formData.sightingTimeUtc).toISOString(),
          notes: formData.notes.trim() || undefined,
          newImageFile: formData.newImageFile || undefined
        };

        await updateSighting(sightingToEdit.id, updatePayload);
      } else {
        // Modo crear: crear nuevo avistamiento
        let motorcycleId: string;

        if (foundMotorcycle) {
          // Usar motocicleta existente
          motorcycleId = foundMotorcycle.id;
        } else {
          // Crear nueva motocicleta
          if (!formData.brandId) {
            notifyError('Por favor, selecciona una marca para la nueva motocicleta');
            return;
          }

          const newMotorcyclePayload: CreateMotorcyclePayload = {
            brandId: formData.brandId,
            licensePlate: formData.licensePlate.trim(),
            model: formData.model.trim() || undefined,
            year: formData.year || undefined,
            displacement: formData.displacement && formData.displacement.trim() ? parseInt(formData.displacement.toString()) : undefined,
            color: formData.color.trim() || undefined
          };

          console.log('Datos del formulario antes de crear motocicleta:', formData);
          console.log('Payload para crear motocicleta:', newMotorcyclePayload);

          const newMotorcycle = await createMotorcycle(newMotorcyclePayload);
          console.log('Motocicleta creada exitosamente:', newMotorcycle);
          
          if (!newMotorcycle || !newMotorcycle.id) {
            notifyError('Error: No se pudo crear la motocicleta correctamente');
            return;
          }
          
          motorcycleId = newMotorcycle.id;
          console.log('ID de motocicleta para crear avistamiento:', motorcycleId);
        }

        // Crear avistamiento con imagen
        const sightingPayload: CreateSightingWithImagePayload = {
          cameraId: formData.cameraId,
          motorcycleId: motorcycleId,
          imageFile: formData.imageFile!,
          sightingTimeUtc: new Date(formData.sightingTimeUtc).toISOString(),
          notes: formData.notes.trim() || undefined
        };

        console.log('Datos del avistamiento antes de crear:', sightingPayload);
        console.log('ID de motocicleta válido:', motorcycleId);

        await createSightingWithImage(sightingPayload);
      }

      // Éxito: cerrar modal y notificar
      // Mostrar mensaje de éxito
      notifySuccess(`Avistamiento ${isEditMode ? 'actualizado' : 'creado'} exitosamente`);
      
      onSightingCreated();
      onClose();
      resetForm();

    } catch (err) {
      console.error('Error processing sighting:', err);
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } };
        
        console.error('Detalles del error:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.response?.data?.message,
          errors: axiosError.response?.data?.errors
        });
        
        if (axiosError.response?.data?.errors) {
          // Mostrar errores de validación específicos
          const validationErrors = axiosError.response.data.errors;
          const errorMessages = Object.entries(validationErrors).map(([field, messages]) => {
            return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
          });
          notifyError(`Errores de validación: ${errorMessages.join('; ')}`);
        } else if (axiosError.response?.data?.message) {
          notifyError(axiosError.response.data.message);
        } else {
          notifyError(`Error al ${isEditMode ? 'actualizar' : 'crear'} el avistamiento`);
        }
      } else {
        notifyError(`Error al ${isEditMode ? 'actualizar' : 'crear'} el avistamiento`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    if (!isEditMode) {
      setFormData({
        cameraId: '',
        licensePlate: '',
        imageFile: null,
        newImageFile: null,
        sightingTimeUtc: new Date().toISOString().slice(0, 16),
        notes: '',
        brandId: '',
        model: '',
        year: new Date().getFullYear(),
        displacement: '',
        color: ''
      });
      setFoundMotorcycle(null);
      setShowNewMotorcycleForm(false);
      setImagePreview(null);
    }
    setNewImagePreview(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Editar Avistamiento' : 'Registrar Nuevo Avistamiento'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {isLoadingData && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Cargando datos...</span>
            </div>
          )}

          {!isLoadingData && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selección de cámara */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cámara *
                </label>
                <select
                  name="cameraId"
                  value={formData.cameraId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  aria-label="Seleccionar cámara"
                >
                  <option value="">Selecciona una cámara</option>
                  {cameras.map(camera => (
                    <option key={camera.id} value={camera.id}>
                      {camera.name} - {camera.location?.city || 'Sin ubicación'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Matrícula */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matrícula *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    placeholder="Ej: ABC-123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isEditMode}
                  />
                  {isSearchingMotorcycle && (
                    <div className="absolute right-3 top-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                
                {foundMotorcycle && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 font-medium">✓ Motocicleta encontrada</p>
                    <p className="text-sm text-green-600">
                      {foundMotorcycle.brandName} {foundMotorcycle.model} ({foundMotorcycle.year})
                    </p>
                  </div>
                )}
              </div>

              {/* Formulario para nueva motocicleta */}
              {showNewMotorcycleForm && !isEditMode && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h3 className="font-medium text-yellow-800 mb-3">Crear nueva motocicleta</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marca *
                      </label>
                      <select
                        name="brandId"
                        value={formData.brandId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        aria-label="Seleccionar marca"
                      >
                        <option value="">Selecciona una marca</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Modelo
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Modelo de la motocicleta"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Año
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Año de la motocicleta"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cilindrada (cc)
                      </label>
                      <select
                        name="displacement"
                        value={formData.displacement}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Seleccionar cilindrada"
                      >
                        <option value="">Selecciona cilindrada</option>
                        <option value="50">50cc</option>
                        <option value="110">110cc</option>
                        <option value="125">125cc</option>
                        <option value="150">150cc</option>
                        <option value="200">200cc</option>
                        <option value="250">250cc</option>
                        <option value="300">300cc</option>
                        <option value="500">500cc</option>
                        <option value="650">650cc</option>
                        <option value="750">750cc</option>
                        <option value="1000">1000cc</option>
                        <option value="1200">1200cc</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Color de la motocicleta"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Subida de imagen */}
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen del Avistamiento *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    title="Seleccionar imagen del avistamiento"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tipos permitidos: JPG, PNG, GIF, BMP, WebP. Tamaño máximo: 10MB.
                  </p>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="max-w-full h-32 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Mostrar imagen actual y opción para cambiarla en modo edición */}
              {isEditMode && sightingToEdit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen del Avistamiento
                  </label>
                  <div className="space-y-3">
                    {/* Imagen actual */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                      {sightingToEdit.imageUrl ? (
                        <img
                          src={getImageUrl(sightingToEdit.imageUrl)}
                          alt="Imagen actual del avistamiento"
                          className="max-w-full h-32 object-cover rounded-md border border-gray-300"
                          onError={(e) => {
                            console.error('Error loading image:', getImageUrl(sightingToEdit.imageUrl));
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Im00IDhzMC00IDQtNGg4YzQgMCA0IDQgNCA0djd2M2gtMlY5aC00VjBoLTJWOUg0djdIMnYtM1Y4eiI+PC9wYXRoPjwvc3ZnPg==';
                          }}
                        />
                      ) : (
                        <div className="max-w-full h-32 bg-gray-100 rounded-md border border-gray-300 flex items-center justify-center">
                          <span className="text-gray-500">Sin imagen</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Opción para subir nueva imagen */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Subir nueva imagen (opcional):</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Seleccionar nueva imagen del avistamiento"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Tipos permitidos: JPG, PNG, GIF, BMP, WebP. Tamaño máximo: 10MB.
                      </p>
                      
                      {/* Preview de la nueva imagen */}
                      {newImagePreview && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Nueva imagen:</p>
                          <img
                            src={newImagePreview}
                            alt="Vista previa de la nueva imagen"
                            className="max-w-full h-32 object-cover rounded-md border border-gray-300"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Fecha y hora */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha y Hora del Avistamiento *
                </label>
                <input
                  type="datetime-local"
                  name="sightingTimeUtc"
                  value={formData.sightingTimeUtc}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  title="Fecha y hora del avistamiento"
                />
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas adicionales
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Información adicional sobre el avistamiento..."
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting 
                    ? (isEditMode ? 'Actualizando...' : 'Registrando...') 
                    : (isEditMode ? 'Actualizar Avistamiento' : 'Registrar Avistamiento')
                  }
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSightingModal;
