import { useState } from 'react';

// ─── ConnectionTest: Verifies frontend ↔ backend communication ────────────────
// Uses Vite proxy — fetch('/api/health') is forwarded to http://localhost:5000/api/health
const ConnectionTest = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testConnection = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/health');

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      setError('Failed to connect to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ marginBottom: '1rem', color: '#333' }}>🔌 Backend Connection Test</h3>

      <button onClick={testConnection} disabled={loading} style={buttonStyle}>
        {loading ? 'Testing...' : 'Test Connection'}
      </button>

      {message && <div style={successStyle}>✅ Success: {message}</div>}
      {error && <div style={errorStyle}>❌ {error}</div>}

      <div style={infoStyle}>
        <p><strong>Backend URL:</strong> http://localhost:5000</p>
        <p><strong>Frontend URL:</strong> http://localhost:5173</p>
        <p><strong>Connection method:</strong> Vite Proxy → CORS</p>
      </div>
    </div>
  );
};

const containerStyle = { padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px', margin: '1rem 0' };
const buttonStyle = { backgroundColor: '#007bff', color: 'white', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.95rem' };
const successStyle = { marginTop: '1rem', padding: '0.75rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', border: '1px solid #c3e6cb' };
const errorStyle = { marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', border: '1px solid #f5c6cb' };
const infoStyle = { marginTop: '1rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '5px', fontSize: '0.85rem', lineHeight: '1.8' };

export default ConnectionTest;
