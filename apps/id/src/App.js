import { useEffect, useState } from 'react';
import Landing from './pages/public/Landing';
import { AppNavigation } from './navigation';
import { useAuth } from './contexts/AuthContext';

const HOME_URL = process.env.REACT_APP_HOME_URL;

function App() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      window.location.href = HOME_URL;
    }
  }, [currentUser])

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
