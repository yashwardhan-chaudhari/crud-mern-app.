import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Prevents logged-in users from accessing login/register pages
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="spinner" />
      </div>
    );
  }

  // Already logged in → send to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
