using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Domain.Entities;


namespace MotorcycleManager.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Brand> Brands { get; }
    DbSet<Camera> Cameras { get; }
    DbSet<Motorcycle> Motorcycles { get; }
    DbSet<Sighting> Sightings { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}