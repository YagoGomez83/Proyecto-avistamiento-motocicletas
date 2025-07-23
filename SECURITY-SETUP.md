# 🔐 Configuración de Seguridad y Variables de Entorno

## ⚠️ ARCHIVOS SENSIBLES EXCLUIDOS DE GIT

Los siguientes archivos contienen información sensible y **NO** están incluidos en el repositorio:

### Backend (C# .NET)
- `src/MotorcycleManager.WebAPI/appsettings.json` - Contiene:
  - Cadenas de conexión a base de datos
  - Claves secretas JWT
  - Configuraciones de producción

### Frontend (React/Vite)
- `frontend/.env` - Contiene:
  - URLs de APIs
  - Claves de configuración del cliente

## 🛠️ Configuración Inicial del Proyecto

### 1. Backend - Configurar appsettings.json

1. Copiar el archivo template:
   ```bash
   cp src/MotorcycleManager.WebAPI/appsettings.template.json src/MotorcycleManager.WebAPI/appsettings.json
   ```

2. Editar `appsettings.json` con tus valores reales:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=motorcycle_manager_v2;User=tu_usuario;Password=tu_password;"
     },
     "JwtSettings": {
       "SecretKey": "tu_clave_secreta_jwt_minimo_32_caracteres",
       "Issuer": "MotorcycleManagerAPI",
       "Audience": "MotorcycleManagerClient"
     }
   }
   ```

### 2. Frontend - Configurar variables de entorno

1. Copiar el archivo template:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. Editar `frontend/.env` si es necesario:
   ```
   VITE_API_BASE_URL=http://localhost:5167/api
   ```

## 🔑 Generación de Claves Seguras

### JWT Secret Key
Debe ser una cadena de al menos 32 caracteres. Puedes generar una usando:

**PowerShell:**
```powershell
[System.Web.Security.Membership]::GeneratePassword(64, 10)
```

**Node.js:**
```javascript
require('crypto').randomBytes(32).toString('hex')
```

**Online:** Usar herramientas como [passwordsgenerator.net](https://passwordsgenerator.net/)

## 🚨 Buenas Prácticas de Seguridad

1. **Nunca** commitear archivos con credenciales reales
2. Usar variables de entorno en producción
3. Rotar claves periódicamente
4. Usar conexiones SSL/TLS en producción
5. Implementar autenticación de dos factores donde sea posible

## 📋 Checklist de Seguridad

- [ ] `appsettings.json` configurado con credenciales reales
- [ ] `frontend/.env` configurado
- [ ] JWT Secret Key generada securely (32+ caracteres)
- [ ] Credenciales de base de datos configuradas
- [ ] Archivo `.gitignore` aplicado correctamente
- [ ] Templates creados para nuevos desarrolladores

## 🆘 Problemas Comunes

### Error: "Connection string not found"
- Verificar que `appsettings.json` existe y tiene la estructura correcta
- Confirmar que la cadena de conexión es válida

### Error: "JWT key too short"
- La clave JWT debe tener al menos 32 caracteres
- Regenerar una clave más larga

### Error: "API not accessible"
- Verificar que `VITE_API_BASE_URL` en `.env` apunta al servidor correcto
- Confirmar que el backend está ejecutándose

## 👥 Para Nuevos Desarrolladores

1. Clonar el repositorio
2. Seguir los pasos de "Configuración Inicial del Proyecto"
3. Instalar dependencias: `npm install` en la carpeta frontend
4. Restaurar paquetes .NET: `dotnet restore` en la carpeta src
5. Ejecutar migraciones de base de datos si es necesario
6. Iniciar el proyecto siguiendo las instrucciones del README principal
