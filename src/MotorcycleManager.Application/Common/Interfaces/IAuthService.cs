using MotorcycleManager.Application.Auth.Dtos;
using MotorcycleManager.Application.Auth.Commands.Login;

namespace MotorcycleManager.Application.Common.Interfaces;

public interface IAuthService
{
    Task<string> LoginAsync(LoginCommand command);
    Task<AuthResponse> RegisterAsync(CreateUserRequest request);
    Task<CreateUserResult> CreateUserAsync(CreateUserRequest request);
    Task<bool> ValidateToken(string token);
}
