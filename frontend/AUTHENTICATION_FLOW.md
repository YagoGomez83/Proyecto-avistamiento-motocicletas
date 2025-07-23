# Flujo de Autenticación - Motorcycle Manager

## 🔐 Implementación Completa de Autenticación JWT

### ✅ Componentes Implementados:

#### 1. **Backend (API)**
- **Endpoints de Autenticación**:
  - `POST /api/auth/register` - Registro de usuarios
  - `POST /api/auth/login` - Inicio de sesión
- **Protección de Endpoints**:
  - `[Authorize]` en `BrandsController` y `MotorcyclesController`
  - Todos los endpoints requieren token JWT válido

#### 2. **Frontend (React)**
- **Contexto de Autenticación** (`AuthContext.tsx`):
  - Manejo global del estado de autenticación
  - Decodificación automática del token JWT
  - Persistencia en localStorage
- **Hook personalizado** (`useAuth.ts`):
  - Interfaz simple para acceder al contexto
- **Servicios API** (`apiService.ts`):
  - Funciones `loginUser()` y `registerUser()`
  - Interceptores automáticos para incluir token JWT
  - Manejo de errores 401 (redirección a login)

#### 3. **Componentes UI**
- **LoginPage** (`LoginPage.tsx`):
  - Formulario de login con validación
  - Manejo de errores
  - Redirección automática después del login
- **Header** (`Header.tsx`):
  - Navegación dinámica según estado de autenticación
  - Botón de logout
  - Mensaje de bienvenida personalizado

### 🚀 Cómo Usar la Aplicación:

#### **Paso 1: Crear Usuario**
```bash
# Usando PowerShell/curl
Invoke-RestMethod -Uri "http://localhost:5167/api/auth/register" -Method POST -ContentType "application/json" -Body '{"username": "demo", "name": "Demo", "lastName": "User", "email": "demo@test.com", "password": "Demo123!", "confirmPassword": "Demo123!"}'
```

#### **Paso 2: Probar en la Interfaz**
1. Abrir http://localhost:5173
2. Hacer clic en "Iniciar Sesión"
3. Ingresar credenciales:
   - **Username**: `demo` (o `testuser`)
   - **Password**: `Demo123!` (o `Test123!`)
4. Observar cambios en la interfaz:
   - Header muestra "Bienvenido, Demo User"
   - Botón de "Cerrar Sesión" disponible

#### **Paso 3: Probar Protección**
1. Sin login: Las peticiones a `/api/brands` fallan con 401
2. Con login: Las peticiones incluyen automáticamente `Authorization: Bearer <token>`

### 🔧 Arquitectura Técnica:

#### **Flujo de Autenticación**:
```
1. Usuario ingresa credenciales
2. Frontend llama a POST /api/auth/login
3. Backend valida y devuelve JWT
4. Frontend guarda token en localStorage
5. AuthContext decodifica y extrae datos del usuario
6. Interceptores de axios añaden token a todas las peticiones
7. Backend valida token en endpoints protegidos
```

#### **Estructura del Token JWT**:
```json
{
  "nameidentifier": "user-id",
  "name": "username",
  "emailaddress": "email",
  "name": "firstName",
  "lastName": "lastName",
  "fullName": "firstName lastName",
  "exp": 1234567890,
  "iss": "MotorcycleManagerAPI",
  "aud": "MotorcycleManagerClient"
}
```

### 🛡️ Seguridad Implementada:

1. **Tokens JWT**: Firmados con clave secreta
2. **Expiración**: Tokens tienen fecha de vencimiento
3. **Interceptores**: Manejo automático de tokens expirados
4. **Validación**: Backend verifica cada petición
5. **Limpieza**: Tokens inválidos se eliminan automáticamente

### 📱 Características de UX:

- **Persistencia**: El login se mantiene al recargar la página
- **Navegación**: Rutas protegidas y públicas
- **Feedback**: Mensajes de error claros
- **Responsive**: Diseño adaptativo
- **Logout**: Limpieza completa del estado

### 🔄 Estados de la Aplicación:

- **No autenticado**: Muestra botón "Iniciar Sesión"
- **Autenticado**: Muestra bienvenida y botón "Cerrar Sesión"
- **Token expirado**: Redirección automática a login
- **Error de red**: Manejo graceful de errores

---

## 🎯 Próximos Pasos Sugeridos:

1. **Página de Registro**: Interfaz para crear nuevos usuarios
2. **Roles y Permisos**: Autorización basada en roles
3. **Perfil de Usuario**: Página para editar información personal
4. **Recuperación de Contraseña**: Flujo de reset de password
5. **Refresh Tokens**: Renovación automática de tokens
