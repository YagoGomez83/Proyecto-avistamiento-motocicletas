using MotorcycleManager.Domain.Common;

namespace MotorcycleManager.Domain.Entities;

public class Sighting : AuditableEntity
{
    public DateTime SightingTimeUtc { get; private set; }
    public string ImageUrl { get; private set; }
    public string? Notes { get; private set; }
    public Guid CameraId { get; private set; }
    public Camera Camera { get; private set; } = null!;
    public Guid MotorcycleId { get; private set; }
    public Motorcycle Motorcycle { get; private set; } = null!;

    private Sighting() { ImageUrl = string.Empty; }

    public static Sighting Create(Guid cameraId, Guid motorcycleId, string imageUrl, DateTime sightingTimeUtc, string? notes = null)
    {
        if (cameraId == Guid.Empty || motorcycleId == Guid.Empty || string.IsNullOrWhiteSpace(imageUrl))
            throw new ArgumentException("CameraId, MotorcycleId, and ImageUrl are required.");

        return new Sighting { Id = Guid.NewGuid(), CameraId = cameraId, MotorcycleId = motorcycleId, ImageUrl = imageUrl, SightingTimeUtc = sightingTimeUtc, Notes = notes };
    }

    public void Update(Guid cameraId, DateTime sightingTimeUtc, string? notes = null)
    {
        if (cameraId == Guid.Empty)
            throw new ArgumentException("CameraId is required.");

        CameraId = cameraId;
        SightingTimeUtc = sightingTimeUtc;
        Notes = notes;
    }

    public void UpdateImage(string imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
            throw new ArgumentException("ImageUrl is required.");

        ImageUrl = imageUrl;
    }
}
