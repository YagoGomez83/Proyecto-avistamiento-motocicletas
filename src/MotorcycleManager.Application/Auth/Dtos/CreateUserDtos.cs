namespace MotorcycleManager.Application.Auth.Dtos;

public class CreateUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class CreateUserResult
{
    public bool Success { get; set; }
    public string[] Errors { get; set; } = Array.Empty<string>();
    public Guid? UserId { get; set; }
}
