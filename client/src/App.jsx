import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import Header from './components/layout/Header';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider must be inside BrowserRouter (uses useNavigate) */}
      <AuthProvider>
        {/* ── ToastContainer (Lesson 3.9): must be in root component ─── */}
        {/* Renders toast notifications app-wide from any component      */}
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />

        <Header />

        <main>
          <Routes>
            {/* ── Public Routes ─────────────────────────────────────────── */}
            <Route path="/" element={<Home />} />

            {/* PublicRoute redirects logged-in users to /dashboard */}
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

            {/* ── Protected Routes (Lesson 3.5) ─────────────────────────── */}
            {/* ProtectedRoute redirects unauthenticated users to /login   */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />

            {/* 404 fallback */}
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h1 style={{ fontSize: '4rem', color: '#ddd' }}>404</h1>
                <p style={{ color: '#666' }}>Page not found.</p>
              </div>
            } />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
