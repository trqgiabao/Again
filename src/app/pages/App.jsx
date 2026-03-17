import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppRoutes from './Routes';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
