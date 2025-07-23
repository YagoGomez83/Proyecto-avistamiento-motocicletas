using MediatR;
using MotorcycleManager.Application.Auth.Commands.Register;
using MotorcycleManager.Application.Auth.Dtos;
using MotorcycleManager.Application.Common.Interfaces;

namespace MotorcycleManager.Application.Auth.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly IAuthService _authService;

    public RegisterCommandHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var createUserRequest = new CreateUserRequest
        {
            Username = request.Username,
            Name = request.Name,
            LastName = request.LastName,
            Email = request.Email,
            Password = request.Password
        };

        return await _authService.RegisterAsync(createUserRequest);
    }
}
