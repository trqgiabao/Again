import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../shared/layouts/AuthLayout';
import './SignInPage.css';

const LOGIN_URL = 'https://freckly-hyperarchaeological-thea.ngrok-free.dev/api/auth/login';

const SignInPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || 'Sign in failed');
      }

      setSuccess('Sign in successful');

      if (data?.token) {
        localStorage.setItem('token', data.token);
      }

      if (data?.accessToken) {
        localStorage.setItem('token', data.accessToken);
      }

      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      const role = data?.user?.role || data?.role;

      if (role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (role === 'Franchisee') {
        navigate('/franchisee/dashboard');
      } else if (role === 'Manager') {
        navigate('/manager/stores');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="signin-page">
        <div className="signin-card">
          <h1 className="signin-title">Sign in</h1>
          <p className="signin-desc">Enter your credentials to access your account.</p>

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="signin-group">
              <label htmlFor="username" className="signin-label">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="signin-input"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="signin-group">
              <label htmlFor="password" className="signin-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="signin-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <p className="signin-error">{error}</p>}
            {success && <p className="signin-success">{success}</p>}

            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="signin-footer">
            Don’t have an account?{' '}
            <Link to="/" className="signin-link">
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignInPage;