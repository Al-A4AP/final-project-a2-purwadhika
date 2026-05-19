import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import './App.css'

function App() {
  // We don't subscribe to the full store object to prevent infinite loops

  // Initialize stores on mount
  useEffect(() => {
    useAuthStore.getState().hydrate();
    useThemeStore.getState().hydrate();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
