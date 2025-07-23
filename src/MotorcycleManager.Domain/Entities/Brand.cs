using MotorcycleManager.Domain.Common;

namespace MotorcycleManager.Domain.Entities;

public class Brand : AuditableEntity
{
    public string Name { get; private set; }
    public ICollection<Motorcycle> Motorcycles { get; private set; } = new List<Motorcycle>();

    private Brand() { Name = string.Empty; }

    public static Brand Create(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Brand name is required.");
        return new Brand { Id = Guid.NewGuid(), Name = name };
    }
    public void UpdateName(string newName)
    {
        if (!string.IsNullOrWhiteSpace(newName))
        {
            Name = newName;
        }
    }

    public void Delete()
    {
        IsDeleted = true;
    }
}