namespace MotorcycleManager.Application.Cameras.Dtos;

/// <summary>
/// Representa la información de una dirección para ser enviada al cliente.
/// </summary>
public class AddressDto
{
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
}
