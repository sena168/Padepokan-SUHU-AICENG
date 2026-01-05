import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LessonProvider } from './contexts/LessonContext';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import LessonPage from './pages/LessonPage';
import GoogleCallback from './pages/GoogleCallback';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LessonProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<Index />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/lesson/:lessonId' element={<LessonPage />} />
                <Route
                  path='/auth/google/callback'
                  element={<GoogleCallback />}
                />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LessonProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
