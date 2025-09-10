import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/common';
import { HomePage } from './pages/Home';
import { UsersPage } from './pages/Users';  
import { PostsPage } from './pages/Posts';
import { ToastProvider } from './contexts/ToastContext';
import { DataRefreshProvider } from './contexts/DataRefreshContext';

function AppContent() {
  const location = useLocation();

  const getPageTitle = (path: string): string => {
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/users':
        return 'User Management';
      case '/posts':
        return 'Post Management';
      default:
        return 'Dashboard';
    }
  };

  return (
    <Layout title={getPageTitle(location.pathname)}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <ToastProvider>
        <DataRefreshProvider>
          <AppContent />
        </DataRefreshProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
