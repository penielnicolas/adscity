import { useEffect, useState } from 'react';
import Landing from './pages/public/Landing';
import { AppNavigation } from './navigation';

function App() {
  const [loading, setLoading] = useState(true);

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
        : <AppNavigation />
      }
    </div>
  );
}

export default App;
