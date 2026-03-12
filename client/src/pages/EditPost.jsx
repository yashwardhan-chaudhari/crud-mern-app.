import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const EditPost = () => {
  const { id } = useParams(); // Gets :id from /edit/:id
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // ─── Pre-fill form with existing data (Lesson 3.8) ─────────────────────────
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setFormData({ title: data.data.title, content: data.data.content });
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to load post';
        toast.error(msg); // 403 if not your post, 404 if not found
        navigate('/dashboard');
      } finally {
        setIsFetching(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.put(`/posts/${id}`, {
        title: formData.title.trim(),
        content: formData.content.trim(),
      });
      toast.success('Post updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      // Lesson 3.9: Backend error → toast.error
      // e.g. 403 "You don't have permission to edit this post"
      const msg = error.response?.data?.message || 'Failed to update post';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="spinner" />
        <p style={{ color: '#666', marginTop: '1rem' }}>Loading post...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={titleStyle}>Edit Post</h1>
          <Link to="/dashboard" style={cancelLinkStyle}>← Back</Link>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label htmlFor="title" style={labelStyle}>Title *</label>
            <input
              type="text" id="title" name="title"
              value={formData.title} onChange={handleChange}
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
              rows={10}
              style={errors.content ? { ...textareaStyle, borderColor: '#dc3545' } : textareaStyle}
              disabled={isLoading}
            />
            {errors.content && <span style={errorTextStyle}>{errors.content}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/dashboard" style={cancelBtnStyle}>Cancel</Link>
            <button type="submit" style={isLoading ? buttonDisabledStyle : buttonStyle} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
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
const buttonStyle = { padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 'bold', color: 'white', backgroundColor: '#28a745', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const buttonDisabledStyle = { ...buttonStyle, backgroundColor: '#6c757d', cursor: 'not-allowed' };
const cancelBtnStyle = { padding: '0.75rem 1.5rem', fontSize: '1rem', color: '#666', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '6px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' };
const cancelLinkStyle = { color: '#007bff', textDecoration: 'none', fontSize: '0.9rem' };

export default EditPost;
