import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Layout } from '@components/layout/Layout';
import { AdsList } from '@pages/AdsList/AdsList';
import { AdDetail } from '@pages/AdDetail/AdDetail';
import { Stats } from '@pages/Stats/Stats';
import { AnimatedPage } from '@components/AnimatedPage';

// Создаем клиент React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Компонент с анимированными маршрутами
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/list" replace />} />
          <Route path="list" element={<AnimatedPage><AdsList /></AnimatedPage>} />
          <Route path="item/:id" element={<AnimatedPage><AdDetail /></AnimatedPage>} />
          <Route path="stats" element={<AnimatedPage><Stats /></AnimatedPage>} />
          <Route path="*" element={<Navigate to="/list" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
