using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Infrastructure.Persistence;
using FluentValidation.AspNetCore;
using FluentValidation;
using System.Reflection;
using Microsoft.AspNetCore.Identity;
using MotorcycleManager.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MotorcycleManager.Infrastructure.Services;
using MotorcycleManager.WebAPI.Converters;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.OpenApi.Models;
using MotorcycleManager.Application.Common.Mappings;

var builder = WebApplication.CreateBuilder(args);
const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          // Permite peticiones desde la URL de desarrollo de Vite
                          policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});
// Configuración de Servicios
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

// Configuración de Identity
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
    // Configuración de contraseña
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;

    // Configuración de usuario
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false; // Para desarrollo
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Configuración de JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "MySecretKeyForJWT2025!@#$%^&*()";
var issuer = jwtSettings["Issuer"] ?? "MotorcycleManagerAPI";
var audience = jwtSettings["Audience"] ?? "MotorcycleManagerClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

// Servicios de aplicación
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<ISightingReportService, SightingReportService>();

builder.Services.AddMediatR(typeof(IApplicationDbContext).Assembly);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Agregar el conversor personalizado para EngineDisplacement
        options.JsonSerializerOptions.Converters.Add(new EngineDisplacementConverter());
        // Mantener el conversor general para otros enums
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssembly(typeof(IApplicationDbContext).Assembly);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAutoMapper(typeof(IApplicationDbContext).Assembly);
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<AbsoluteUrlResolver>();

// Configuración de Swagger/OpenAPI
builder.Services.AddSwaggerGen(options =>
{
    // Información básica de la API
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MotorcycleManager API",
        Version = "v1",
        Description = "API para la gestión de avistamientos de motocicletas",
        Contact = new OpenApiContact
        {
            Name = "MotorcycleManager Team"
        }
    });

    // Incluir documentación XML
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }

    // Configuración de autenticación JWT Bearer
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Por favor, introduce 'Bearer' seguido de un espacio y el token JWT",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Pipeline de HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Solo usar redirección HTTPS si hay un puerto HTTPS configurado
if (app.Configuration.GetValue<string>("ASPNETCORE_URLS")?.Contains("https") == true ||
    app.Urls.Any(url => url.StartsWith("https")))
{
    app.UseHttpsRedirection();
}

app.UseCors(MyAllowSpecificOrigins);

// Configurar archivos estáticos
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");
app.Run();