using AutoMapper;
using MotorcycleManager.Application.Brands.Dtos;
using MotorcycleManager.Application.Cameras.Dtos;
using MotorcycleManager.Application.Motorcycles.Dtos;
using MotorcycleManager.Application.Sightings.Dtos;
using MotorcycleManager.Domain.Entities;
using MotorcycleManager.Domain.ValueObjects;

namespace MotorcycleManager.Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {

        CreateMap<Sighting, SightingDto>()
           // Mapea el nombre de la cámara desde la entidad relacionada
           .ForMember(dest => dest.CameraName,
                      opt => opt.MapFrom(src => src.Camera.Name))
           // Mapea los detalles de la moto desde la entidad relacionada
           .ForMember(dest => dest.MotorcycleLicensePlate,
                      opt => opt.MapFrom(src => src.Motorcycle.LicensePlate))
           .ForMember(dest => dest.MotorcycleModel,
                      opt => opt.MapFrom(src => src.Motorcycle.Model))
           .ForMember(dest => dest.MotorcycleYear,
                      opt => opt.MapFrom(src => src.Motorcycle.Year))
           .ForMember(dest => dest.MotorcycleDisplacement,
                       opt => opt.MapFrom(src => (int?)src.Motorcycle.Displacement))
           .ForMember(dest => dest.MotorcycleColor,
                      opt => opt.MapFrom(src => src.Motorcycle.Color))
           // Mapea el nombre de la marca desde la entidad anidada
           .ForMember(dest => dest.MotorcycleBrandName,
                      opt => opt.MapFrom(src => src.Motorcycle.Brand.Name))

             .ForMember(dest => dest.ImageUrl, 
               opt => opt.MapFrom<AbsoluteUrlResolver>());
        // Mapeo de Brand a BrandDto
        CreateMap<Brand, BrandDto>();

        // Mapeo de Motorcycle a MotorcycleDto
        CreateMap<Motorcycle, MotorcycleDto>()
            // Mapeo personalizado para aplanar el nombre de la marca
            .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand.Name));

        // Mapeo de Camera a CameraDto
        CreateMap<Camera, CameraDto>()
            .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.Location));

        // Mapeo de Address ValueObject a AddressDto
        CreateMap<Address, AddressDto>();

        // Aquí añadiremos todos nuestros futuros mapeos...
    }
}