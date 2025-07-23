using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Domain.Common;
using MotorcycleManager.Domain.Entities;
using MotorcycleManager.Infrastructure.Identity;
using System.Reflection;

namespace MotorcycleManager.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Camera> Cameras => Set<Camera>();
    public DbSet<Motorcycle> Motorcycles => Set<Motorcycle>();
    public DbSet<Sighting> Sightings => Set<Sighting>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(builder);

        // Filtros globales para el borrado lógico
        builder.Entity<Brand>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Camera>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Motorcycle>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Sighting>().HasQueryFilter(e => !e.IsDeleted);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
        {
            if (entry.State == EntityState.Added)
                entry.Entity.CreatedAtUtc = DateTime.UtcNow;
            else if (entry.State == EntityState.Modified)
                entry.Entity.LastModifiedAtUtc = DateTime.UtcNow;
        }
        return await base.SaveChangesAsync(cancellationToken);
    }
}

