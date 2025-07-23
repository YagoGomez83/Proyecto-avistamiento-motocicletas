using MotorcycleManager.Domain.Common;
using MotorcycleManager.Domain.ValueObjects;

namespace MotorcycleManager.Domain.Entities;

public class Camera : AuditableEntity
{
    public string Name { get; private set; }
    public Address? Location { get; private set; }
    public ICollection<Sighting> Sightings { get; private set; } = new List<Sighting>();

    private Camera() { Name = string.Empty; }

    public static Camera Create(string name, Address? location = null)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Camera name is required.");
        return new Camera { Id = Guid.NewGuid(), Name = name, Location = location };
    }

    public void UpdateDetails(string name, Address? location = null)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Camera name is required.");
        Name = name;
        Location = location;
    }

    public void Delete()
    {
        IsDeleted = true;
    }
}