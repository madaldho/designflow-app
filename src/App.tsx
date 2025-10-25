import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Layout Components
import AppLayout from '@/components/layout/AppLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import ScrollToTop from '@/components/ScrollToTop';

// Page Components - Lazy loaded for performance
const LandingPage = React.lazy(() => import('@/pages/LandingPage'));
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPageNew'));
const ProjectsPage = React.lazy(() => import('@/pages/projects/ProjectsPage'));
const ProjectDetailPage = React.lazy(() => import('@/pages/projects/ProjectDetailPage'));
const RequestDesignPage = React.lazy(() => import('@/pages/RequestDesignPage'));
const DesignerPanelPage = React.lazy(() => import('@/pages/designer/DesignerPanelPage'));
const ReviewPanelPage = React.lazy(() => import('@/pages/review/ReviewPanelPage'));
const PrintQueuePage = React.lazy(() => import('@/pages/print/PrintQueuePage'));
const AdminPage = React.lazy(() => import('@/pages/admin/AdminPage'));
const AnalyticsPage = React.lazy(() => import('@/pages/analytics/AnalyticsPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const DebugPage = React.lazy(() => import('@/pages/DebugPage'));
const DiagnosticPage = React.lazy(() => import('@/pages/DiagnosticPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRoles?: string[] }> = ({ 
  children, 
  requiredRoles 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  // const { user } = useAuth(); // Uncomment when role checking is needed

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Add role-based checking when needed
  // if (requiredRoles && user && !requiredRoles.includes(user.role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />
        
        <Route path="/login" element={
          <PublicRoute>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/projects" element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectsPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/projects/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectDetailPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/request-design" element={
          <ProtectedRoute>
            <AppLayout>
              <RequestDesignPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/designer-panel" element={
          <ProtectedRoute>
            <AppLayout>
              <DesignerPanelPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/review-panel" element={
          <ProtectedRoute>
            <AppLayout>
              <ReviewPanelPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/print-queue" element={
          <ProtectedRoute>
            <AppLayout>
              <PrintQueuePage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AppLayout>
              <AdminPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute>
            <AppLayout>
              <AnalyticsPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/debug" element={
          <ProtectedRoute>
            <AppLayout>
              <DebugPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Diagnostic page - NO AUTH REQUIRED for troubleshooting */}
        <Route path="/diagnostic" element={<DiagnosticPage />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="App min-h-screen bg-gray-50">
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
