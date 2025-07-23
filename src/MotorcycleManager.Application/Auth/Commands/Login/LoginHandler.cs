using MediatR;
using MotorcycleManager.Application.Auth.Commands.Login;
using MotorcycleManager.Application.Common.Interfaces;

namespace MotorcycleManager.Application.Auth.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, string>
{
    private readonly IAuthService _authService;

    public LoginCommandHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<string> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        return await _authService.LoginAsync(request);
    }
}
