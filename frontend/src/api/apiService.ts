import axios from 'axios';
import type { MotorcycleDto, BrandDto, CameraDto, SightingDto, CreateSightingDto } from '../types/motorcycle';
import type { 
  SightingCountByCamera, 
  SightingCountByBrand, 
  SightingCountByEngineDisplacement 
} from '../types/reportTypes';

// La URL base de nuestra API .NET.
// Asegúrate de que los puertos coincidan con los de tu launchSettings.json.
const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5167/api';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido, limpiar el localStorage
      localStorage.removeItem('authToken');
      // Opcional: redirigir al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos para autenticación
export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email?: string;
  };
}

// Definimos los parámetros para la query de motocicletas
export interface GetAllMotorcyclesParams {
  brandId?: string;
  model?: string;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateBrandPayload {
  name: string;
}

// Interfaces para autenticación
export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
}

export interface CreateCameraPayload {
  name: string;
  location?: {
    street: string;
    number?: string;
    city: string;
    state?: string;
    zipCode?: string;
    country: string;
  };
}

export interface CreateCameraResponse {
  id: string;
}

export interface CreateMotorcyclePayload {
  brandId: string;
  licensePlate?: string;
  model?: string;
  year?: number;
  displacement?: number; // Cambiar para que coincida con el enum value
  color?: string;
}

export interface CreateMotorcycleResponse {
  id: string;
}

export interface UpdateMotorcyclePayload {
  id: string;
  brandId: string;
  licensePlate?: string;
  model?: string;
  year?: number;
  displacement?: number;
  color?: string;
}

export interface CreateSightingPayload {
  cameraId: string;
  motorcycleId: string;
  imageUrl: string;
  sightingTimeUtc: string;
  notes?: string;
}

export interface CreateSightingResponse {
  id: string;
}

export interface UpdateSightingPayload {
  cameraId: string;
  sightingTimeUtc: string;
  notes?: string;
  newImageFile?: File;
}

// =================== MOTORCYCLE FUNCTIONS ===================

export const getMotorcycles = async (params: GetAllMotorcyclesParams): Promise<MotorcycleDto[]> => {
  try {
    // 'params' se convertirá automáticamente en query string: ?brandId=...&pageNumber=...
    const response = await apiClient.get('/motorcycles', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching motorcycles:', error);
    // En una app real, manejaríamos este error de forma más elegante.
    return []; 
  }

};

export const createBrand = async (payload: CreateBrandPayload): Promise<BrandDto> => {
  try {
    const response = await apiClient.post('/brands', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating brand:', error);
    throw error; // Relanzamos el error para que el componente lo maneje
  }
};

// Funciones de autenticación
export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// =================== SIGHTING FUNCTIONS ===================

export const getRecentSightings = async (limit: number = 10): Promise<SightingDto[]> => {
  try {
    const response = await apiClient.get(`/sightings/recent?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent sightings:', error);
    // Return mock data for development
    return generateMockSightings(limit);
  }
};

export const getSightingById = async (id: string): Promise<SightingDto> => {
  try {
    const response = await apiClient.get(`/sightings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sighting by ID:', error);
    throw error;
  }
};

export const deleteSighting = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/sightings/${id}`);
  } catch (error) {
    console.error('Error deleting sighting:', error);
    throw error;
  }
};

export const updateSighting = async (id: string, payload: UpdateSightingPayload): Promise<void> => {
  try {
    // Siempre usar FormData para que coincida con el backend
    const formData = new FormData();
    formData.append('cameraId', payload.cameraId);
    formData.append('sightingTimeUtc', payload.sightingTimeUtc);
    if (payload.notes) {
      formData.append('notes', payload.notes);
    }
    if (payload.newImageFile) {
      formData.append('newImageFile', payload.newImageFile);
    }

    await apiClient.put(`/sightings/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Error updating sighting:', error);
    throw error;
  }
};

export const createSightingWithImage = async (payload: CreateSightingWithImagePayload): Promise<{ id: string }> => {
  try {
    const formData = new FormData();
    formData.append('cameraId', payload.cameraId);
    formData.append('motorcycleId', payload.motorcycleId);
    formData.append('imageFile', payload.imageFile);
    formData.append('sightingTimeUtc', payload.sightingTimeUtc);
    if (payload.notes) {
      formData.append('notes', payload.notes);
    }

    const response = await apiClient.post('/sightings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating sighting with image:', error);
     if (axios.isAxiosError(error)) {
      console.error('Backend validation errors:', error.response?.data);
    }
    throw error;
  }
};

export const createSighting = async (payload: CreateSightingDto): Promise<SightingDto> => {
  try {
    const response = await apiClient.post('/sightings', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating sighting:', error);
    throw error;
  }
};

// =================== CAMERA FUNCTIONS ===================

export const getCameras = async (): Promise<CameraDto[]> => {
  try {
    const response = await apiClient.get('/cameras');
    return response.data;
  } catch (error) {
    console.error('Error fetching cameras:', error);
    throw error; // Lanzamos el error para que el componente lo maneje
  }
};

export const createCamera = async (payload: CreateCameraPayload): Promise<CreateCameraResponse> => {
  const response = await apiClient.post('/cameras', payload);
  return response.data;
};

export const updateCamera = async (id: string, payload: CreateCameraPayload): Promise<void> => {
  try {
    await apiClient.put(`/cameras/${id}`, payload);
  } catch (error) {
    console.error('Error updating camera:', error);
    throw error;
  }
};

export const deleteCamera = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/cameras/${id}`);
  } catch (error) {
    console.error('Error deleting camera:', error);
    throw error;
  }
};

export const createMotorcycle = async (payload: CreateMotorcyclePayload): Promise<CreateMotorcycleResponse> => {
  const response = await apiClient.post('/motorcycles', payload);
  return response.data;
};

export const getMotorcycleById = async (id: string): Promise<MotorcycleDto> => {
  const response = await apiClient.get(`/motorcycles/${id}`);
  return response.data;
};

export const updateMotorcycle = async (id: string, payload: UpdateMotorcyclePayload): Promise<void> => {
  try {
    await apiClient.put(`/motorcycles/${id}`, payload);
  } catch (error) {
    console.error('Error updating motorcycle:', error);
    throw error;
  }
};

export const deleteMotorcycle = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/motorcycles/${id}`);
  } catch (error) {
    console.error('Error deleting motorcycle:', error);
    throw error;
  }
};

export const getSightingsForMotorcycle = async (motorcycleId: string): Promise<SightingDto[]> => {
  try {
    const response = await apiClient.get(`/motorcycles/${motorcycleId}/sightings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sightings for motorcycle:', error);
    throw error;
  }
};

// =================== MOTORCYCLE SEARCH FUNCTIONS ===================

export const findMotorcycleByLicensePlate = async (licensePlate: string): Promise<MotorcycleDto | null> => {
  try {
    const response = await apiClient.get(`/motorcycles/by-license-plate/${encodeURIComponent(licensePlate)}`);
    return response.data;
  } catch (error) {
    // Si devuelve 404, significa que no se encontró la motocicleta
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        return null;
      }
    }
    throw error;
  }
};

export const getBrands = async (): Promise<BrandDto[]> => {
  try {
    const response = await apiClient.get('/brands');
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
};

export const updateBrand = async (id: string, payload: { id: string; name: string }): Promise<void> => {
  try {
    await apiClient.put(`/brands/${id}`, payload);
  } catch (error) {
    console.error('Error updating brand:', error);
    throw error;
  }
};

export const deleteBrand = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/brands/${id}`);
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
};

// =================== SIGHTINGS API ===================

export interface CreateSightingWithImagePayload {
  cameraId: string;
  motorcycleId: string;
  imageFile: File;
  sightingTimeUtc: string;
  notes?: string;
}

// =================== REPORTS API ===================

export interface ReportFilters {
  startDate?: string; // YYYY-MM-DD format
  endDate?: string;   // YYYY-MM-DD format
}

/**
 * Obtiene el reporte de avistamientos agrupados por cámara
 * @param filters Filtros opcionales para el reporte
 * @returns Promise con array de conteos por cámara
 */
export const getReportByCamera = async (filters?: ReportFilters): Promise<SightingCountByCamera[]> => {
  try {
    let url = '/sightings/reports/by-camera';
    const queryParams: string[] = [];
    
    if (filters?.startDate) {
      queryParams.push(`startDate=${filters.startDate}`);
    }
    if (filters?.endDate) {
      queryParams.push(`endDate=${filters.endDate}`);
    }
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    const response = await apiClient.get<SightingCountByCamera[]>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching sighting reports by camera:', error);
    throw error;
  }
};

/**
 * Obtiene el reporte de avistamientos agrupados por marca
 * @param filters Filtros opcionales para el reporte
 * @returns Promise con array de conteos por marca
 */
export const getReportByBrand = async (filters?: ReportFilters): Promise<SightingCountByBrand[]> => {
  try {
    let url = '/sightings/reports/by-brand';
    const queryParams: string[] = [];
    
    if (filters?.startDate) {
      queryParams.push(`startDate=${filters.startDate}`);
    }
    if (filters?.endDate) {
      queryParams.push(`endDate=${filters.endDate}`);
    }
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    const response = await apiClient.get<SightingCountByBrand[]>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching sighting reports by brand:', error);
    throw error;
  }
};

/**
 * Obtiene el reporte de avistamientos agrupados por cilindrada
 * @param filters Filtros opcionales para el reporte
 * @returns Promise con array de conteos por cilindrada
 */
export const getReportByEngineDisplacement = async (filters?: ReportFilters): Promise<SightingCountByEngineDisplacement[]> => {
  try {
    let url = '/sightings/reports/by-engine-displacement';
    const queryParams: string[] = [];
    
    if (filters?.startDate) {
      queryParams.push(`startDate=${filters.startDate}`);
    }
    if (filters?.endDate) {
      queryParams.push(`endDate=${filters.endDate}`);
    }
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    const response = await apiClient.get<SightingCountByEngineDisplacement[]>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching sighting reports by engine displacement:', error);
    throw error;
  }
};

// =================== MOCK DATA FOR DEVELOPMENT ===================

const generateMockSightings = (limit: number): SightingDto[] => {
  const mockSightings: SightingDto[] = [];
  const now = new Date();
  
  for (let i = 0; i < limit; i++) {
    const sightingTime = new Date(now.getTime() - (i * 2 * 60 * 60 * 1000)); // 2 hours apart
    mockSightings.push({
      id: `sighting-${i + 1}`,
      sightingTimeUtc: sightingTime.toISOString(),
      imageUrl: '', // No usar placeholder URLs - usar imágenes reales o vacías
      notes: i % 3 === 0 ? `Avistamiento ${i + 1} - Velocidad elevada` : undefined,
      cameraId: `camera-${(i % 3) + 1}`,
      cameraName: `Cámara ${(['Principal', 'Secundaria', 'Auxiliar'])[i % 3]}`,
      motorcycleId: `moto-${i + 1}`,
      motorcycleLicensePlate: `ABC${String(i + 100).padStart(3, '0')}`,
      motorcycleModel: ['Ninja', 'CBR', 'R1', 'Duke', 'MT'][i % 5],
      motorcycleYear: 2020 + (i % 4),
      motorcycleDisplacement: [600, 750, 1000, 250, 300][i % 5],
      motorcycleColor: ['Rojo', 'Azul', 'Negro', 'Blanco', 'Verde'][i % 5],
      motorcycleBrandName: ['Kawasaki', 'Honda', 'Yamaha'][i % 3]
    });
  }
  
  return mockSightings;
};