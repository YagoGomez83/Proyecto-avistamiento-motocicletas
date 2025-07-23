import { Outlet } from 'react-router-dom';
import Header from './components/Header';

function App() {
  // App ahora actúa como una plantilla o layout.
  // Contiene los elementos comunes como el Header.
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        {/* El <Outlet> es el marcador de posición donde React Router
            renderizará el componente de la ruta hija activa. */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;