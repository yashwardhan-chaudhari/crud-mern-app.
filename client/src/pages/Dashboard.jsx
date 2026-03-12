import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // ─── READ with pagination (Lesson 3.7) ─────────────────────────────────────
  const fetchPosts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/posts?page=${page}&limit=10`);
      setPosts(data.data);
      setPagination(data.pagination);
    } catch (error) {
      // toast.error from catch block — demonstrates Lesson 3.9 pattern
      const msg = error.response?.data?.message || 'Failed to load posts';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  // ─── DELETE with authorization check + toast (Lesson 3.8, 3.9) ────────────
  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    // Optimistic update — remove from UI immediately
    const previousPosts = posts;
    setPosts((prev) => prev.filter((p) => p._id !== postId));

    try {
      await api.delete(`/posts/${postId}`);
      toast.success('Post deleted successfully!');
      // Refresh to update pagination counts
      fetchPosts(pagination.currentPage);
    } catch (error) {
      // Revert optimistic update on failure
      setPosts(previousPosts);
      const msg = error.response?.data?.message || 'Failed to delete post';
      toast.error(msg); // e.g. "You don't have permission to delete this post" (403)
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="spinner" />
        <p style={{ color: '#666', marginTop: '1rem' }}>Loading your posts...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header row */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#333' }}>
            Welcome, {user?.name}!
          </h1>
          <p style={{ color: '#666', marginTop: '0.25rem' }}>
            {pagination.totalPosts} post{pagination.totalPosts !== 1 ? 's' : ''} total
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/create" style={createBtnStyle}>+ New Post</Link>
          <button onClick={logout} style={logoutBtnStyle}>Logout</button>
        </div>
      </div>

      {/* User info card */}
      <div style={infoCardStyle}>
        <strong>Account:</strong> {user?.email} &nbsp;·&nbsp;
        <strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div style={emptyStyle}>
          <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '1rem' }}>No posts yet!</p>
          <Link to="/create" style={createBtnStyle}>Create Your First Post</Link>
        </div>
      ) : (
        <div style={postsGridStyle}>
          {posts.map((post) => (
            <div key={post._id} style={postCardStyle}>
              <div style={{ flex: 1 }}>
                <h3 style={postTitleStyle}>{post.title}</h3>
                <p style={postContentStyle}>{post.content.slice(0, 120)}{post.content.length > 120 ? '...' : ''}</p>
                <p style={postMetaStyle}>{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              <div style={postActionsStyle}>
                <Link to={`/edit/${post._id}`} style={editBtnStyle}>Edit</Link>
                <button onClick={() => handleDelete(post._id)} style={deleteBtnStyle}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls (Lesson 3.7) */}
      {pagination.totalPages > 1 && (
        <div style={paginationStyle}>
          <button
            onClick={() => fetchPosts(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage || loading}
            style={pagination.hasPrevPage ? pageBtnStyle : pageBtnDisabledStyle}
          >
            ← Previous
          </button>
          <span style={pageInfoStyle}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchPosts(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage || loading}
            style={pagination.hasNextPage ? pageBtnStyle : pageBtnDisabledStyle}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

const containerStyle = { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' };
const createBtnStyle = { backgroundColor: '#007bff', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600' };
const logoutBtnStyle = { background: 'none', border: '1px solid #dc3545', color: '#dc3545', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' };
const infoCardStyle = { backgroundColor: '#e8f4fd', border: '1px solid #bee3f8', borderRadius: '8px', padding: '0.75rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#2c5282' };
const emptyStyle = { textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' };
const postsGridStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const postCardStyle = { backgroundColor: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' };
const postTitleStyle = { fontSize: '1.1rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem' };
const postContentStyle = { color: '#555', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '0.5rem' };
const postMetaStyle = { color: '#999', fontSize: '0.8rem' };
const postActionsStyle = { display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexShrink: 0 };
const editBtnStyle = { backgroundColor: '#f0f4ff', color: '#007bff', border: '1px solid #bbd0ff', padding: '0.4rem 0.9rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' };
const deleteBtnStyle = { backgroundColor: '#fff5f5', color: '#e53e3e', border: '1px solid #feb2b2', padding: '0.4rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' };
const paginationStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' };
const pageBtnStyle = { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' };
const pageBtnDisabledStyle = { ...pageBtnStyle, backgroundColor: '#ccc', cursor: 'not-allowed' };
const pageInfoStyle = { color: '#555', fontSize: '0.9rem', fontWeight: '500' };

export default Dashboard;
