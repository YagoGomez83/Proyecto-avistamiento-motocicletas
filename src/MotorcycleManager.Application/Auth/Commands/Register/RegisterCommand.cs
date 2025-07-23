using MediatR;
using MotorcycleManager.Application.Auth.Dtos;

namespace MotorcycleManager.Application.Auth.Commands.Register;

public record RegisterCommand(
    string Username,
    string Name,
    string LastName,
    string Email,
    string Password
) : IRequest<AuthResponse>;
