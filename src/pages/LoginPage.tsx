import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    axios.get('http://localhost:5001/users')
      .then(response => {
        const users = response.data;
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          localStorage.setItem('token', 'dummy-token');
          localStorage.setItem('role', user.role);
          localStorage.setItem('userEmail', user.email);
          if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/home');
          }
        } else {
          setError('Invalid email or password');
        }
      })
      .catch(err => {
        console.error('Login error:', err);
        setError('Login failed');
      });
  };

  return (
    <div className="login-page">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <span className="logo">BLUE TAG</span>
          </div>
        </div>
      </header>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
      <footer className="footer">
        <p>&copy; 2023 GPK Solution</p>
      </footer>
    </div>
  );
};

export default LoginPage;
