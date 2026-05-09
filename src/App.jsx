import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { PageWrapper } from './components/layout/PageWrapper';
import { HomePage } from './pages/public/HomePage';
import { PricingPage } from './pages/public/PricingPage';
import { LoginPage, RegisterPage } from './pages/auth/AuthPages';
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
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-text-muted">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

const AuthCallback = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/auth/login" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route element={<PageWrapper />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/auth/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/auth/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
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

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      >
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
