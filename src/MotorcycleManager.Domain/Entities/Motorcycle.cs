using MotorcycleManager.Domain.Common;
using MotorcycleManager.Domain.Enums;

namespace MotorcycleManager.Domain.Entities;

public class Motorcycle : AuditableEntity
{
    public string? LicensePlate { get; private set; }
    public string? Model { get; private set; }
    public int? Year { get; private set; }
    public EngineDisplacement? Displacement { get; private set; }
    public string? Color { get; private set; }
    public Guid BrandId { get; private set; }
    public Brand Brand { get; private set; } = null!;
    public ICollection<Sighting> Sightings { get; private set; } = new List<Sighting>();

    private Motorcycle() { }

    public static Motorcycle Create(Guid brandId, string? licensePlate, string? model, int? year, EngineDisplacement? displacement, string? color)
    {
        if (brandId == Guid.Empty) throw new ArgumentException("BrandId is required.");
        return new Motorcycle { Id = Guid.NewGuid(), BrandId = brandId, LicensePlate = licensePlate, Model = model, Year = year, Displacement = displacement, Color = color };
    }
}