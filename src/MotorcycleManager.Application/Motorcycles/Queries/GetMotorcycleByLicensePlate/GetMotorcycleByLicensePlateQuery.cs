using MediatR;
using MotorcycleManager.Application.Motorcycles.Dtos;

namespace MotorcycleManager.Application.Motorcycles.Queries.GetMotorcycleByLicensePlate;

public record GetMotorcycleByLicensePlateQuery(string LicensePlate) : IRequest<MotorcycleDto?>;
