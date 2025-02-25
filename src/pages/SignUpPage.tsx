import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SignUpPage.css';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const newUser = { email, password };

    axios.post('http://localhost:5001/users', newUser)
      .then(response => {
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      })
      .catch(err => {
        console.error('Error signing up:', err);
        setError('Failed to sign up');
      });
  };

  return (
    <div className="signup-page">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <span className="logo">BLUE TAG</span>
          </div>
        </div>
      </header>
      <form className="signup-form" onSubmit={handleSignUp}>
        <h2>Sign Up</h2>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
      <footer className="footer">
        <p>&copy; 2023 GPK Solution</p>
      </footer>
    </div>
  );
};

export default SignUpPage;
