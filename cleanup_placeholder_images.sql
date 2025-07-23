-- Script para limpiar URLs de placeholder en la tabla Sightings
-- Este script actualizará las URLs de placeholder con cadenas vacías

-- Mostrar primero los registros que serán afectados
SELECT Id, ImageUrl 
FROM Sightings 
WHERE ImageUrl LIKE '%placeholder%' 
   OR ImageUrl LIKE '%via.placeholder%'
   OR ImageUrl LIKE 'http%placeholder%';

-- Actualizar los registros con URLs de placeholder
UPDATE Sightings 
SET ImageUrl = ''
WHERE ImageUrl LIKE '%placeholder%' 
   OR ImageUrl LIKE '%via.placeholder%'
   OR ImageUrl LIKE 'http%placeholder%';

-- Verificar que los cambios se aplicaron correctamente
SELECT COUNT(*) as 'Registros con placeholder limpiados'
FROM Sightings 
WHERE ImageUrl LIKE '%placeholder%' 
   OR ImageUrl LIKE '%via.placeholder%'
   OR ImageUrl LIKE 'http%placeholder%';
