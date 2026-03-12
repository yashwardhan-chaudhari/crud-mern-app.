import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    else if (formData.name.trim().length > 50) newErrors.name = 'Name cannot exceed 50 characters';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.post('/users/register', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      setSuccessMessage('Account created successfully! Redirecting to login...');
      toast.success('Account created! Please login.');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => (window.location.href = '/login'), 2000);
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Create Your Account</h1>
        <p style={subtitleStyle}>Join Creator's Platform and start creating today</p>

        {successMessage && <div style={successStyle}>{successMessage}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          {[
            { id: 'name', label: 'Name *', type: 'text', placeholder: 'Enter your full name' },
            { id: 'email', label: 'Email *', type: 'email', placeholder: 'Enter your email' },
            { id: 'password', label: 'Password *', type: 'password', placeholder: 'Create a password (min 6 characters)' },
            { id: 'confirmPassword', label: 'Confirm Password *', type: 'password', placeholder: 'Re-enter your password' },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id} style={fieldStyle}>
              <label htmlFor={id} style={labelStyle}>{label}</label>
              <input
                type={type} id={id} name={id}
                value={formData[id]} onChange={handleChange}
                placeholder={placeholder}
                style={errors[id] ? inputErrorStyle : inputStyle}
                disabled={isLoading}
              />
              {errors[id] && <span style={errorTextStyle}>{errors[id]}</span>}
            </div>
          ))}

          <button type="submit" style={isLoading ? buttonDisabledStyle : buttonStyle} disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={linkTextStyle}>
          Already have an account? <Link to="/login" style={linkStyle}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const containerStyle = { minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' };
const formContainerStyle = { maxWidth: '450px', width: '100%', padding: '2.5rem', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };
const titleStyle = { textAlign: 'center', marginBottom: '0.5rem', color: '#333', fontSize: '2rem' };
const subtitleStyle = { textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '0.95rem' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1.2rem' };
const fieldStyle = { display: 'flex', flexDirection: 'column' };
const labelStyle = { marginBottom: '0.4rem', fontWeight: '500', color: '#333', fontSize: '0.9rem' };
const inputStyle = { padding: '0.75rem', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '5px' };
const inputErrorStyle = { ...inputStyle, borderColor: '#dc3545' };
const errorTextStyle = { color: '#dc3545', fontSize: '0.82rem', marginTop: '0.2rem' };
const buttonStyle = { padding: '0.875rem', fontSize: '1rem', fontWeight: 'bold', color: 'white', backgroundColor: '#007bff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '0.5rem' };
const buttonDisabledStyle = { ...buttonStyle, backgroundColor: '#6c757d', cursor: 'not-allowed' };
const successStyle = { padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '1rem', border: '1px solid #c3e6cb' };
const linkTextStyle = { textAlign: 'center', marginTop: '1.5rem', color: '#666' };
const linkStyle = { color: '#007bff', textDecoration: 'none', fontWeight: '500' };

export default Register;
