import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './lib/auth';
import { LanguageProvider } from './context/LanguageContext';
import { PageWrapper } from './components/layout/PageWrapper';
import { HomePage } from './pages/public/HomePage';
import { PricingPage } from './pages/public/PricingPage';
import { LoginPage, RegisterPage } from './pages/auth/AuthPages';
import { AuthCallbackPage } from './pages/auth/AuthCallback';
import { BookingPage } from './pages/booking/BookingPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import {
  AdminDashboardPage,
  AdminBookingsPage,
  AdminAvailabilityPage,
  AdminPackagesPage,
  AdminTestimonialsPage,
  AdminStudentsPage,
} from './pages/admin/AdminDashboard';
import './styles/index.css';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { user, loading, initialized } = AuthProvider ? useAuth() : { user: null, loading: false, initialized: true };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PageWrapper />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/admin" element={<AdminDashboardPage />}>
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="availability" element={<AdminAvailabilityPage />} />
        <Route path="packages" element={<AdminPackagesPage />} />
        <Route path="testimonials" element={<AdminTestimonialsPage />} />
        <Route path="students" element={<AdminStudentsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <AppRoutes />
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;