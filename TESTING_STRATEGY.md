# Testing Strategy - Motorcycle Manager V2

## 🧪 Tipos de Pruebas Implementadas

### Frontend Testing
```bash
# Instalar dependencias de testing
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom

# Ejecutar tests
npm run test
npm run test:watch
npm run test:coverage
```

### Backend Testing
```bash
# Tests unitarios .NET
dotnet test
dotnet test --collect:"XPlat Code Coverage"
```

## 📊 Testing de Reportes

### Tests Unitarios
- ✅ `prepareChartDataForCamera.test.ts`
- ✅ `prepareChartDataForBrand.test.ts`
- ✅ `reportUtils.test.ts`

### Tests de Integración
- ✅ API endpoints con filtros de fecha
- ✅ Hooks de TanStack Query
- ✅ Componentes de gráficos

### Tests E2E
- ✅ Flujo completo de reportes
- ✅ Filtros y exportación
- ✅ Responsive design

## 🔧 Archivos de Configuración Testing

### Frontend (`frontend/vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
})
```

### Backend Testing
- xUnit para tests unitarios
- TestContainers para tests de integración
- Moq para mocking

## 📋 API Testing Manual

Los siguientes archivos `.http` están incluidos en el proyecto para testing manual:

- `test-brands-crud.http` - CRUD de marcas
- `test-cameras-crud.http` - CRUD de cámaras  
- `test-sightings.http` - Operaciones de avistamientos
- `test-sighting-reports.http` - Endpoints de reportes con filtros

## 🎯 Coverage Goals

- **Frontend**: >90% coverage en utils y hooks
- **Backend**: >85% coverage en Application layer
- **Integration**: Todos los endpoints principales

## 📊 Test Data

### Mock Data Strategy
- Datos de prueba consistentes
- Factories para generar test data
- Fixtures para casos específicos

### Database Testing
- In-memory database para tests
- Seed data controlado
- Cleanup automático
