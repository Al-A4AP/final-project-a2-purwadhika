import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import './App.css'

function App() {
   // udh d rbh u hindari loop di simpan ke global state

  // aplikasi pertama dbuka inisasi auth+theme 
  useEffect(() => {
    useAuthStore.getState().hydrate();
    useThemeStore.getState().hydrate();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
