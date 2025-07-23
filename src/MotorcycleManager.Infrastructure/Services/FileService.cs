using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using MotorcycleManager.Application.Common.Interfaces;

namespace MotorcycleManager.Infrastructure.Services;

public class FileService : IFileService
{
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly string _wwwRootPath;

    public FileService(IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
        _wwwRootPath = _webHostEnvironment.WebRootPath ?? throw new InvalidOperationException("WebRootPath is not configured");
    }

    public async Task<string> SaveImageAsync(IFormFile imageFile, string folder)
    {
        if (imageFile == null || imageFile.Length == 0)
            throw new ArgumentException("Image file is required", nameof(imageFile));

        // Validar tipo de archivo
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
        var extension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            throw new ArgumentException($"File type {extension} is not allowed. Allowed types: {string.Join(", ", allowedExtensions)}");

        // Validar tamaño (máximo 10MB)
        if (imageFile.Length > 10 * 1024 * 1024)
            throw new ArgumentException("File size cannot exceed 10MB");

        // Crear directorio si no existe
        var uploadPath = Path.Combine(_wwwRootPath, "images", folder);
        Directory.CreateDirectory(uploadPath);

        // Generar nombre único para el archivo
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadPath, uniqueFileName);

        // Guardar archivo
        using var stream = new FileStream(filePath, FileMode.Create);
        await imageFile.CopyToAsync(stream);

        // Retornar ruta relativa
        return Path.Combine("images", folder, uniqueFileName).Replace('\\', '/');
    }

    public async Task<bool> DeleteImageAsync(string imagePath)
    {
        try
        {
            var fullPath = Path.Combine(_wwwRootPath, imagePath);
            return await Task.Run(() =>
            {
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    return true;
                }
                return false;
            });
        }
        catch
        {
            return false;
        }
    }

    public string GetImageUrl(string imagePath)
    {
        return $"/{imagePath}";
    }
}
