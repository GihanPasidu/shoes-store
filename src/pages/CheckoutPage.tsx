import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/CheckoutPage.css';

interface CheckoutProps {
  totalAmount?: number;
}

const CheckoutPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalAmount } = location.state as CheckoutProps;
  const { clearCart } = useCart();

  const handlePaymentSelection = (method: string) => {
    setPaymentMethod(method);
  };

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      if (paymentMethod === 'pickup') {
        clearCart(); // Clear the cart after successful hold
        navigate('/home'); // Redirect to home page
      } else {
        navigate('/payment', { 
          state: { amount: totalAmount }
        });
      }
    }, 1500);
  };

  return (
    <div className="checkout-page">
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
      <div className="checkout-container">
        <div className="checkout-card">
          <h2>Choose Payment Method</h2>
          <div className="total-amount">
            <h3>Total Amount: ${totalAmount?.toFixed(2)}</h3>
          </div>
          <div className="payment-options">
            <div 
              className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}
              onClick={() => handlePaymentSelection('online')}
            >
              <i className="fas fa-credit-card"></i>
              <h3>Pay Online</h3>
              <p>Secure payment with credit/debit card</p>
            </div>
            <div 
              className={`payment-option ${paymentMethod === 'pickup' ? 'selected' : ''}`}
              onClick={() => handlePaymentSelection('pickup')}
            >
              <i className="fas fa-store"></i>
              <h3>Pay at Store</h3>
              <p>Hold for 24 hours (valid until 8 PM tomorrow)</p>
            </div>
          </div>
          <button 
            className="confirm-button"
            onClick={handleConfirmOrder}
            disabled={!paymentMethod || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Confirm Order'}
          </button>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2023 GPK Solution</p>
      </footer>
    </div>
  );
};

export default CheckoutPage;