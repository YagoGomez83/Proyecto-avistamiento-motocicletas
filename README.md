# Motorcycle Manager V2

## 📋 Descripción
Sistema de gestión de motocicletas con avistamientos por cámaras de seguridad.

## 🚀 Tecnologías
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: .NET Core Web API
- **Base de Datos**: SQL Server / Entity Framework
- **Gráficos**: Chart.js + react-chartjs-2
- **Estado**: TanStack Query
- **Autenticación**: JWT

## 📦 Instalación

### Prerequisites
- Node.js 18+
- .NET 8 SDK
- SQL Server

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd src/MotorcycleManager.WebAPI
dotnet restore
dotnet run
```

## 🎯 Características Principales
- ✅ Gestión de motocicletas (CRUD)
- ✅ Sistema de cámaras de seguridad
- ✅ Avistamientos en tiempo real
- ✅ Reportes y estadísticas interactivas
- ✅ Filtros por rango de fechas
- ✅ Exportación de datos (CSV/PNG)
- ✅ Diseño responsive

## 📊 Reportes
Ver documentación detallada: [REPORTS_IMPLEMENTATION.md](frontend/REPORTS_IMPLEMENTATION.md)

## 🧪 Testing
```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd src
dotnet test
```

## 📝 Estructura del Proyecto
```
MotorcycleManagerV2/
├── frontend/                 # React TypeScript App
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── hooks/          # Custom hooks
│   │   ├── api/            # Servicios API
│   │   └── types/          # Definiciones TypeScript
│   └── package.json
├── src/                     # .NET Backend
│   ├── MotorcycleManager.Application/
│   ├── MotorcycleManager.Domain/
│   ├── MotorcycleManager.Infrastructure/
│   └── MotorcycleManager.WebAPI/
└── README.md
```

## 🔧 Configuración de Desarrollo
1. Copiar `.env.example` a `.env` en el frontend
2. Configurar connection string en `appsettings.json`
3. Ejecutar migraciones de BD
4. Iniciar backend y frontend

## 📋 API Endpoints
- `GET /api/motorcycles` - Lista de motocicletas
- `GET /api/sightings` - Avistamientos
- `GET /api/sightings/reports/*` - Reportes con filtros
- `POST /api/auth/login` - Autenticación

## 🤝 Contribuir
1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia
Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.
