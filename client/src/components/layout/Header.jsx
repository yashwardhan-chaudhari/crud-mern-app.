import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        <Link to="/" style={logoStyle}>
          ✍️ Creator's Platform
        </Link>

        <nav style={navStyle}>
          {user ? (
            <>
              <span style={greetingStyle}>Hi, {user.name}!</span>
              <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
              <Link to="/create" style={navLinkStyle}>+ New Post</Link>
              <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>Login</Link>
              <Link to="/register" style={{ ...navLinkStyle, ...registerBtnStyle }}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const headerStyle = { backgroundColor: '#fff', borderBottom: '1px solid #e9ecef', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' };
const innerStyle = { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' };
const logoStyle = { fontSize: '1.2rem', fontWeight: '700', color: '#333', textDecoration: 'none' };
const navStyle = { display: 'flex', alignItems: 'center', gap: '1rem' };
const navLinkStyle = { color: '#555', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' };
const greetingStyle = { color: '#007bff', fontSize: '0.9rem', fontWeight: '600' };
const logoutBtnStyle = { background: 'none', border: '1px solid #dc3545', color: '#dc3545', padding: '0.3rem 0.8rem', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' };
const registerBtnStyle = { backgroundColor: '#007bff', color: 'white', padding: '0.35rem 0.9rem', borderRadius: '5px' };

export default Header;
