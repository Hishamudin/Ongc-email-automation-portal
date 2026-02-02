import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RequestProvider } from './context/RequestContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RequestDetails from './components/RequestDetails';
import AdminRequests from './components/admin/AdminRequests';
import EmployeeCreationForm from './components/forms/EmployeeCreationForm';
import EmployeeModificationForm from './components/forms/EmployeeModificationForm';
import GroupCreationForm from './components/forms/GroupCreationForm';
import SpecialCreationForm from './components/forms/SpecialCreationForm';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/request/:id" 
          element={
            <ProtectedRoute>
              <RequestDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/form/employee_creation" 
          element={
            <ProtectedRoute>
              <EmployeeCreationForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/form/employee_modification" 
          element={
            <ProtectedRoute>
              <EmployeeModificationForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/form/group_creation" 
          element={
            <ProtectedRoute>
              <GroupCreationForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/form/special_creation" 
          element={
            <ProtectedRoute>
              <SpecialCreationForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/requests" 
          element={
            <ProtectedRoute adminOnly>
              <AdminRequests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/request/:id" 
          element={
            <ProtectedRoute adminOnly>
              <RequestDetails />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RequestProvider>
        <Router>
          <AppContent />
        </Router>
      </RequestProvider>
    </AuthProvider>
  );
};

export default App;