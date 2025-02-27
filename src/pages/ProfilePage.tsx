import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfilePage.css';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const userEmail = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  useEffect(() => {
    axios.get('http://localhost:5001/users')
      .then(response => {
        const user = response.data.find((u: UserProfile) => u.email === userEmail);
        if (user) {
          setUserProfile(user);
        }
      })
      .catch(err => console.error('Error fetching user profile:', err));
  }, [userEmail]);

  if (!userProfile) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/home" className="logo">BLUE TAG</Link>
          </div>
          <div className="header-right">
            <Link to="/cart" className="cart-link">
              <i className="fas fa-shopping-cart"></i>
            </Link>
          </div>
        </div>
      </header>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <i className="fas fa-user-circle profile-icon"></i>
            <h2>My Profile</h2>
          </div>
          <div className="profile-details">
            <div className="detail-item">
              <label>Name:</label>
              <p>{userProfile.name}</p>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <p>{userProfile.email}</p>
            </div>
            <div className="detail-item">
              <label>User ID:</label>
              <p>{userProfile.id}</p>
            </div>
            <div className="detail-item">
              <label>Role:</label>
              <p>{userProfile.role}</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2023 GPK Solution</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
