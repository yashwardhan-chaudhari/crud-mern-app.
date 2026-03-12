import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    else if (formData.content.trim().length < 10) newErrors.content = 'Content must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.post('/posts', {
        title: formData.title.trim(),
        content: formData.content.trim(),
      });
      toast.success('Post created successfully!');
      navigate('/dashboard');
    } catch (error) {
      // Lesson 3.9: catch block → toast.error with backend message
      const msg = error.response?.data?.message || 'Failed to create post. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={titleStyle}>Create New Post</h1>
          <Link to="/dashboard" style={cancelLinkStyle}>← Back</Link>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label htmlFor="title" style={labelStyle}>Title *</label>
            <input
              type="text" id="title" name="title"
              value={formData.title} onChange={handleChange}
              placeholder="Enter post title..."
              style={errors.title ? inputErrorStyle : inputStyle}
              disabled={isLoading}
            />
            {errors.title && <span style={errorTextStyle}>{errors.title}</span>}
          </div>

          <div style={fieldStyle}>
            <label htmlFor="content" style={labelStyle}>Content *</label>
            <textarea
              id="content" name="content"
              value={formData.content} onChange={handleChange}
              placeholder="Write your content here..."
              rows={10}
              style={errors.content ? { ...textareaStyle, borderColor: '#dc3545' } : textareaStyle}
              disabled={isLoading}
            />
            {errors.content && <span style={errorTextStyle}>{errors.content}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Link to="/dashboard" style={cancelBtnStyle}>Cancel</Link>
            <button type="submit" style={isLoading ? buttonDisabledStyle : buttonStyle} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const containerStyle = { maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' };
const formContainerStyle = { backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' };
const titleStyle = { fontSize: '1.6rem', fontWeight: '700', color: '#333' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1.2rem' };
const fieldStyle = { display: 'flex', flexDirection: 'column' };
const labelStyle = { marginBottom: '0.4rem', fontWeight: '600', color: '#444', fontSize: '0.9rem' };
const inputStyle = { padding: '0.75rem', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' };
const inputErrorStyle = { ...inputStyle, borderColor: '#dc3545' };
const textareaStyle = { padding: '0.75rem', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '6px', resize: 'vertical', fontFamily: 'inherit', outline: 'none' };
const errorTextStyle = { color: '#dc3545', fontSize: '0.82rem', marginTop: '0.2rem' };
const buttonStyle = { padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 'bold', color: 'white', backgroundColor: '#007bff', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const buttonDisabledStyle = { ...buttonStyle, backgroundColor: '#6c757d', cursor: 'not-allowed' };
const cancelBtnStyle = { padding: '0.75rem 1.5rem', fontSize: '1rem', color: '#666', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '6px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' };
const cancelLinkStyle = { color: '#007bff', textDecoration: 'none', fontSize: '0.9rem' };

export default CreatePost;
