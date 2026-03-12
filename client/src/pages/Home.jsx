import { Link } from 'react-router-dom';
import ConnectionTest from '../components/common/ConnectionTest';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={containerStyle}>
      {/* Hero */}
      <div style={heroStyle}>
        <h1 style={titleStyle}>Welcome to Creator's Platform</h1>
        <p style={subtitleStyle}>Create, manage, and share your content with the world.</p>
        <div style={ctaStyle}>
          {user ? (
            <Link to="/dashboard" style={primaryBtnStyle}>Go to Dashboard →</Link>
          ) : (
            <>
              <Link to="/register" style={primaryBtnStyle}>Get Started Free</Link>
              <Link to="/login" style={secondaryBtnStyle}>Login</Link>
            </>
          )}
        </div>
      </div>

      {/* Connection Test (Lesson 3.4) */}
      <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
        <ConnectionTest />
      </div>
    </div>
  );
};

const containerStyle = { minHeight: '80vh', padding: '2rem' };
const heroStyle = { textAlign: 'center', padding: '4rem 2rem' };
const titleStyle = { fontSize: '2.8rem', fontWeight: '700', color: '#333', marginBottom: '1rem' };
const subtitleStyle = { fontSize: '1.2rem', color: '#666', marginBottom: '2rem' };
const ctaStyle = { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' };
const primaryBtnStyle = { backgroundColor: '#007bff', color: 'white', padding: '0.8rem 2rem', borderRadius: '8px', textDecoration: 'none', fontSize: '1rem', fontWeight: '600' };
const secondaryBtnStyle = { backgroundColor: 'transparent', color: '#007bff', padding: '0.8rem 2rem', borderRadius: '8px', textDecoration: 'none', fontSize: '1rem', fontWeight: '600', border: '2px solid #007bff' };

export default Home;
