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

interface Order {
  orderId: string;
  id: string;
  items: string[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  date: string;
  pickupDeadline: string | null;
}

interface OrderWithItems extends Order {
  itemDetails: Array<{
    name: string;
    price: string;
    quantity: number;
  }>;
}

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
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
      .then(async response => {
        const user = response.data.find((u: UserProfile) => u.email === userEmail);
        if (user) {
          setUserProfile(user);

          // Fetch user's orders
          const ordersResponse = await axios.get('http://localhost:5001/orders');
          const allOrders = ordersResponse.data;
          
          // Get only orders array, not the nested objects
          const ordersList = Array.isArray(allOrders) ? allOrders : [];
          
          // Filter orders for current user
          const userOrders = ordersList.filter((order: Order) => order.id === user.id);

          // Fetch shoes data to get item details
          const shoesResponse = await axios.get('http://localhost:5000/shoes');
          const shoes = shoesResponse.data;

          // Combine orders with item details
          const ordersWithItems = userOrders.map((order: Order) => {
            const itemCounts = order.items.reduce((acc: {[key: string]: number}, id: string) => {
              acc[id] = (acc[id] || 0) + 1;
              return acc;
            }, {});

            const itemDetails = Object.entries(itemCounts).map(([itemId, quantity]) => {
              const shoe = shoes.find((s: any) => s.id === itemId);
              return {
                name: shoe?.name || 'Unknown Item',
                price: shoe?.price || '$0',
                quantity
              };
            });

            return {
              ...order,
              itemDetails
            };
          });

          setOrders(ordersWithItems);
        }
      })
      .catch(err => console.error('Error fetching data:', err));
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

          <div className="orders-section">
            <h3>My Orders</h3>
            {orders.length === 0 ? (
              <p className="no-orders">No orders found</p>
            ) : (
              orders.map(order => (
                <div key={order.orderId} className="order-item">
                  <div className="order-header">
                    <span className="order-id">Order ID: {order.orderId}</span>
                    <span className="order-date">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="order-details">
                    {order.itemDetails.map((item, index) => (
                      <p key={index}>
                        {item.name} x {item.quantity} ({item.price} each)
                      </p>
                    ))}
                    <p>Total Amount: ${order.totalAmount}</p>
                    <p>Payment Method: {order.paymentMethod}</p>
                    {order.pickupDeadline && (
                      <p>Pickup Deadline: {new Date(order.pickupDeadline).toLocaleString()}</p>
                    )}
                  </div>
                  <span className={`order-status status-${order.status}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              ))
            )}
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
