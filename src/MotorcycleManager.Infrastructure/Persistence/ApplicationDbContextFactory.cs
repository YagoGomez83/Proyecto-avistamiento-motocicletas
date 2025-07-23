
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace MotorcycleManager.Infrastructure.Persistence;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        // Start from current directory and find the WebAPI project
        string currentDirectory = Directory.GetCurrentDirectory();
        string basePath;

        // If we're in the root directory, look for the WebAPI project
        if (Directory.Exists(Path.Combine(currentDirectory, "src", "MotorcycleManager.WebAPI")))
        {
            basePath = Path.Combine(currentDirectory, "src", "MotorcycleManager.WebAPI");
        }
        // If we're already in the WebAPI directory
        else if (currentDirectory.EndsWith("MotorcycleManager.WebAPI"))
        {
            basePath = currentDirectory;
        }
        // If we're in src directory
        else if (Directory.Exists(Path.Combine(currentDirectory, "MotorcycleManager.WebAPI")))
        {
            basePath = Path.Combine(currentDirectory, "MotorcycleManager.WebAPI");
        }
        // Fallback: search upwards for the WebAPI project
        else
        {
            var directory = new DirectoryInfo(currentDirectory);
            while (directory != null)
            {
                var webApiPath = Path.Combine(directory.FullName, "src", "MotorcycleManager.WebAPI");
                if (Directory.Exists(webApiPath))
                {
                    basePath = webApiPath;
                    break;
                }
                directory = directory.Parent;
            }

            if (directory == null)
                throw new InvalidOperationException($"Could not find MotorcycleManager.WebAPI project from current directory: {currentDirectory}");

            basePath = Path.Combine(directory.FullName, "src", "MotorcycleManager.WebAPI");
        }

        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrEmpty(connectionString))
            throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
