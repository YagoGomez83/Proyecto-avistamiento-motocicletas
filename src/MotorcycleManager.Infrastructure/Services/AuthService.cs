using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MotorcycleManager.Application.Auth.Dtos;
using MotorcycleManager.Application.Auth.Commands.Login;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Infrastructure.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MotorcycleManager.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    public async Task<string> LoginAsync(LoginCommand command)
    {
        // Primero intentamos encontrar el usuario por username
        var user = await _userManager.FindByNameAsync(command.Username);
        
        // Si no se encuentra por username, intentamos por email
        if (user == null)
        {
            user = await _userManager.FindByEmailAsync(command.Username);
        }
        
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        // Verificar la contraseña
        var result = await _signInManager.CheckPasswordSignInAsync(user, command.Password, false);
        if (!result.Succeeded)
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        // Generar y retornar el token JWT
        return await GenerateJwtToken(user);
    }

    public async Task<AuthResponse> RegisterAsync(CreateUserRequest request)
    {
        var createResult = await CreateUserAsync(request);
        if (!createResult.Success)
        {
            var errors = string.Join("; ", createResult.Errors);
            throw new InvalidOperationException($"Failed to create user: {errors}");
        }

        var user = await _userManager.FindByIdAsync(createResult.UserId.ToString()!);
        if (user == null)
        {
            throw new InvalidOperationException("User was created but could not be retrieved");
        }

        var token = await GenerateJwtToken(user);
        var expiresAt = DateTime.UtcNow.AddDays(7);

        return new AuthResponse
        {
            Token = token,
            RefreshToken = "",
            ExpiresAt = expiresAt,
            User = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                LastName = user.LastName,
                Email = user.Email ?? "",
                FullName = user.FullName
            }
        };
    }

    public async Task<CreateUserResult> CreateUserAsync(CreateUserRequest request)
    {
        // Verificar si el usuario ya existe
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return new CreateUserResult
            {
                Success = false,
                Errors = new[] { "User with this email already exists" }
            };
        }

        var existingUserByUsername = await _userManager.FindByNameAsync(request.Username);
        if (existingUserByUsername != null)
        {
            return new CreateUserResult
            {
                Success = false,
                Errors = new[] { "User with this username already exists" }
            };
        }

        // Crear el nuevo usuario
        var user = new ApplicationUser
        {
            UserName = request.Username,
            Email = request.Email,
            Name = request.Name,
            LastName = request.LastName,
            EmailConfirmed = true // Para desarrollo, en producción debería ser false
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return new CreateUserResult
            {
                Success = false,
                Errors = result.Errors.Select(e => e.Description).ToArray()
            };
        }

        return new CreateUserResult
        {
            Success = true,
            UserId = user.Id
        };
    }

    public async Task<string> GenerateJwtToken(ApplicationUser user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
        var issuer = jwtSettings["Issuer"] ?? "MotorcycleManagerAPI";
        var audience = jwtSettings["Audience"] ?? "MotorcycleManagerClient";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName ?? ""),
            new(ClaimTypes.Email, user.Email ?? ""),
            new("name", user.Name),
            new("lastName", user.LastName),
            new("fullName", user.FullName)
        };

        // Agregar roles si existen
        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public Task<bool> ValidateToken(string token)
    {
        try
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
            var issuer = jwtSettings["Issuer"] ?? "MotorcycleManagerAPI";
            var audience = jwtSettings["Audience"] ?? "MotorcycleManagerClient";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var tokenHandler = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = issuer,
                ValidAudience = audience,
                IssuerSigningKey = key,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
            return Task.FromResult(validatedToken != null);
        }
        catch
        {
            return Task.FromResult(false);
        }
    }
}
