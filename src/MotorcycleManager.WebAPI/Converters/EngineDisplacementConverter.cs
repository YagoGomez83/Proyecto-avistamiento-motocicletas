using System.Text.Json;
using System.Text.Json.Serialization;
using MotorcycleManager.Domain.Enums;

namespace MotorcycleManager.WebAPI.Converters;

/// <summary>
/// Conversor personalizado para el enum EngineDisplacement que permite 
/// deserializar tanto valores numéricos como strings del JSON.
/// </summary>
public class EngineDisplacementConverter : JsonConverter<EngineDisplacement?>
{
    public override EngineDisplacement? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
        {
            return null;
        }

        if (reader.TokenType == JsonTokenType.Number)
        {
            var numericValue = reader.GetInt32();
            
            // Mapear valores numéricos a enum
            return numericValue switch
            {
                50 => EngineDisplacement.Cc50,
                110 => EngineDisplacement.Cc110,
                125 => EngineDisplacement.Cc125,
                150 => EngineDisplacement.Cc150,
                200 => EngineDisplacement.Cc200,
                250 => EngineDisplacement.Cc250,
                300 => EngineDisplacement.Cc300,
                500 => EngineDisplacement.Cc500,
                650 => EngineDisplacement.Cc650,
                750 => EngineDisplacement.Cc750,
                1000 => EngineDisplacement.Cc1000,
                1200 => EngineDisplacement.Cc1200,
                _ => throw new JsonException($"El valor {numericValue} no es un valor válido para EngineDisplacement. Valores válidos: 50, 110, 125, 150, 200, 250, 300, 500, 650, 750, 1000, 1200")
            };
        }

        if (reader.TokenType == JsonTokenType.String)
        {
            var stringValue = reader.GetString();
            
            // Intentar parsear como nombre del enum (ej: "Cc250")
            if (Enum.TryParse<EngineDisplacement>(stringValue, true, out var enumValue))
            {
                return enumValue;
            }
            
            // Intentar parsear como valor numérico en string (ej: "250")
            if (int.TryParse(stringValue, out var numericValue))
            {
                return numericValue switch
                {
                    50 => EngineDisplacement.Cc50,
                    110 => EngineDisplacement.Cc110,
                    125 => EngineDisplacement.Cc125,
                    150 => EngineDisplacement.Cc150,
                    200 => EngineDisplacement.Cc200,
                    250 => EngineDisplacement.Cc250,
                    300 => EngineDisplacement.Cc300,
                    500 => EngineDisplacement.Cc500,
                    650 => EngineDisplacement.Cc650,
                    750 => EngineDisplacement.Cc750,
                    1000 => EngineDisplacement.Cc1000,
                    1200 => EngineDisplacement.Cc1200,
                    _ => throw new JsonException($"El valor '{stringValue}' no es un valor válido para EngineDisplacement. Valores válidos: 50, 110, 125, 150, 200, 250, 300, 500, 650, 750, 1000, 1200")
                };
            }
            
            throw new JsonException($"El valor '{stringValue}' no es un valor válido para EngineDisplacement. Valores válidos: 50, 110, 125, 150, 200, 250, 300, 500, 650, 750, 1000, 1200");
        }

        throw new JsonException($"Tipo de token inesperado: {reader.TokenType}");
    }

    public override void Write(Utf8JsonWriter writer, EngineDisplacement? value, JsonSerializerOptions options)
    {
        if (value == null)
        {
            writer.WriteNullValue();
        }
        else
        {
            // Escribir el valor numérico del enum
            writer.WriteNumberValue((int)value);
        }
    }
}
