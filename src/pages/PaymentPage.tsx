import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/PaymentPage.css';

interface PaymentProps {
  amount?: number;
}

const PaymentPage: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { amount } = location.state as PaymentProps;
  const { clearCart } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      clearCart(); // Clear the cart after successful payment
      navigate('/home'); // Redirect to home page
    }, 2000);
  };

  return (
    <div className="payment-page">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/home" className="logo">BLUE TAG</Link>
          </div>
          <div className="header-right">
            <Link to="/profile" className="profile-link">
              <i className="fas fa-user"></i>
            </Link>
          </div>
        </div>
      </header>
      <div className="payment-container">
        <div className="payment-card">
          <h2>Card Payment</h2>
          <div className="amount-display">
            <h3>Amount to Pay: ${amount?.toFixed(2)}</h3>
          </div>
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="1234 5678 9012 3456"
                required
                maxLength={16}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="MM/YY"
                  required
                  maxLength={4}
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  required
                  maxLength={3}
                />
              </div>
            </div>
            <button 
              type="submit"
              className="pay-button"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${amount?.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2023 GPK Solution</p>
      </footer>
    </div>
  );
};

export default PaymentPage;