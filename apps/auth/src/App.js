import AppRouter from './AppRouter';
import { useEffect, useState } from 'react';
import Landing from './pages/public/Landing';
import { initializeCsrf } from './services/csrf';

function App() {
  const [loading, setLoading] = useState(true);

  // Initialiser CSRF au démarrage
  initializeCsrf().catch(console.error);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ?
        <Landing />
        : <AppRouter />
      }
    </div>
  );
}

export default App;
