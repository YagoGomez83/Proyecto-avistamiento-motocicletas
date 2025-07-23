import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSightingById, deleteSighting } from '../api/apiService';
import type { SightingDto } from '../types/motorcycle';

export const useSightingDetail = () => {
  const { sightingId } = useParams<{ sightingId: string }>();
  const navigate = useNavigate();
  
  // Estados principales
  const [sighting, setSighting] = useState<SightingDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchSighting = async () => {
      if (!sightingId) {
        setError('ID de avistamiento no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const sightingData = await getSightingById(sightingId);
        setSighting(sightingData);
      } catch (err) {
        console.error('Error fetching sighting:', err);
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as { response?: { status?: number } };
          if (axiosError.response?.status === 404) {
            setError('Avistamiento no encontrado');
          } else {
            setError('Error al cargar el avistamiento');
          }
        } else {
          setError('Error al cargar el avistamiento');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSighting();
  }, [sightingId]);

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getDisplacementText = (displacement?: number) => {
    if (!displacement) return 'No especificado';
    return `${displacement}cc`;
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sightingId) return;

    try {
      setDeleting(true);
      await deleteSighting(sightingId);
      // Redirigir al inicio con mensaje de éxito
      navigate('/', { 
        state: { 
          message: 'Avistamiento eliminado correctamente',
          type: 'success' 
        } 
      });
    } catch (error) {
      console.error('Error deleting sighting:', error);
      setError('Error al eliminar el avistamiento');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  const handleSightingUpdated = async () => {
    // Refrescar los datos del avistamiento
    if (!sightingId) return;
    
    try {
      const updatedSighting = await getSightingById(sightingId);
      setSighting(updatedSighting);
    } catch (err) {
      console.error('Error refreshing sighting:', err);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  // Interfaz del hook - todo lo que necesita el componente UI
  return {
    // Estados principales
    sighting,
    loading,
    error,
    
    // Estados de modales
    showDeleteModal,
    deleting,
    showEditModal,
    
    // Funciones de manejo
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleEditClick,
    handleEditClose,
    handleSightingUpdated,
    handleGoBack,
    
    // Funciones utilitarias
    formatDateTime,
    getDisplacementText
  };
};
