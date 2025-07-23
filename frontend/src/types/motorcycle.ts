// src/types/motorcycle.ts

export interface MotorcycleDto {
  id: string; // Guid se convierte en string en JSON
  licensePlate?: string;
  model?: string;
  year?: number;
  displacement?: number;
  color?: string;
  brandId: string;
  brandName: string;
}

export interface BrandDto {
  id: string;
  name: string;
  createdAtUtc: string; // DateTime se convierte en string
}

export interface CameraDto {
  id: string;
  name: string;
  location?: AddressDto;
  createdAtUtc: string;
}

export interface AddressDto {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface SightingDto {
  id: string;
  sightingTimeUtc: string; // DateTime as ISO string
  imageUrl: string;
  notes?: string;
  
  // Camera data (flattened)
  cameraId: string;
  cameraName: string;
  
  // Motorcycle data (flattened)
  motorcycleId: string;
  motorcycleLicensePlate?: string;
  motorcycleModel?: string;
  motorcycleBrandName: string;
  motorcycleYear?: number;
  motorcycleColor?: string;
  motorcycleDisplacement?: number;
}

export interface CreateSightingDto {
  cameraId: string;
  motorcycleId?: string; // Optional if creating new motorcycle
  imageUrl: string;
  sightingTimeUtc: string;
  notes?: string;
  // Fields for creating a new motorcycle if needed
  newMotorcycle?: {
    licensePlate?: string;
    model?: string;
    year?: number;
    displacement?: number;
    color?: string;
    brandId: string;
  };
}
