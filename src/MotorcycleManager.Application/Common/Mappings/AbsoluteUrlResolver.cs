// MotorcycleManager.Application/Common/Mappings/AbsoluteUrlResolver.cs

using AutoMapper;
using Microsoft.AspNetCore.Http;
using MotorcycleManager.Domain.Entities; // Asegúrate de que el using a tu DTO sea correcto
using MotorcycleManager.Application.Sightings.Dtos;
using System.Diagnostics;

namespace MotorcycleManager.Application.Common.Mappings;

public class AbsoluteUrlResolver : IValueResolver<Sighting, SightingDto, string>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AbsoluteUrlResolver(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string Resolve(Sighting source, SightingDto destination, string destMember, ResolutionContext context)
    {
        Debug.WriteLine("--- AbsoluteUrlResolver SE ESTÁ EJECUTANDO ---");
        // Si no hay URL de imagen en la base de datos, devolvemos una cadena vacía.
        if (string.IsNullOrEmpty(source.ImageUrl))
        {
            return string.Empty;
        }

        // Si la URL ya es completa (contiene http/https o es un placeholder), la devolvemos tal como está
        if (source.ImageUrl.StartsWith("http://") || source.ImageUrl.StartsWith("https://"))
        {
            // Si es una URL de placeholder, la reemplazamos con una imagen por defecto
            if (source.ImageUrl.Contains("placeholder.com") || source.ImageUrl.Contains("via.placeholder"))
            {
                return string.Empty; // O podrías devolver una imagen por defecto local
            }
            return source.ImageUrl;
        }

        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
        {
            return string.Empty;
        }
        var request = httpContext.Request;

        // Construye la URL base del servidor (ej: https://localhost:5167)
        var baseUrl = $"{request.Scheme}://{request.Host}";

        // Combina la URL base con la ruta relativa de la imagen para crear la URL completa.
        return $"{baseUrl}/{source.ImageUrl.TrimStart('/')}";
    }
}