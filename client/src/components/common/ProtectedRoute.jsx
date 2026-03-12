import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ─── ProtectedRoute: Guards authenticated pages ───────────────────────────────
// Usage: <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait for auth check before deciding (prevents flash)
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="spinner" />
        <p style={{ color: '#666', marginTop: '1rem' }}>Checking authentication...</p>
      </div>
    );
  }

  // Not logged in → redirect to /login
  // replace prevents browser back button returning to protected page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated → render the protected page
  return children;
};

export default ProtectedRoute;
