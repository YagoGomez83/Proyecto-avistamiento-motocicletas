using Microsoft.AspNetCore.Http;

namespace MotorcycleManager.Application.Common.Interfaces;

public interface IFileService
{
    Task<string> SaveImageAsync(IFormFile imageFile, string folder);
    Task<bool> DeleteImageAsync(string imagePath);
    string GetImageUrl(string imagePath);
}
