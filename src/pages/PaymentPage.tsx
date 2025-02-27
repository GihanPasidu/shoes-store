import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/PaymentPage.css';
import axios from 'axios';

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
  const { clearCart, cart } = useCart();
  const userEmail = localStorage.getItem('userEmail');

  const updateShoeQuantities = async (items: string[]) => {
    try {
      const response = await axios.get('http://localhost:5000/shoes');
      const shoes = response.data;
      
      const quantities = items.reduce((acc: {[key: string]: number}, id: string) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});

      const updatedShoes = shoes.map((shoe: any) => {
        if (quantities[shoe.id]) {
          return {
            ...shoe,
            quantity: shoe.quantity - quantities[shoe.id]
          };
        }
        return shoe;
      });

      // Update db.json with new quantities
      await axios.patch('http://localhost:5000/shoes', { shoes: updatedShoes });
    } catch (err) {
      console.error('Error updating shoe quantities:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    axios.get('http://localhost:5001/users')
      .then(async response => {
        const user = response.data.find((u: any) => u.email === userEmail);
        if (user) {
          await updateShoeQuantities(cart);

          const newOrder = {
            orderId: `ORD${Date.now()}`,
            id: user.id,
            items: cart,
            totalAmount: amount,
            paymentMethod: 'card',
            status: 'paid',
            date: new Date().toISOString(),
            pickupDeadline: null
          };

          // Get all orders
          const ordersRes = await axios.get('http://localhost:5001/orders');
          let orders = ordersRes.data;
          
          // Add new order
          if (!Array.isArray(orders)) {
            orders = [];
          }
          
          // Remove nested duplicates if any
          orders = orders.filter((order: any) => !order[0] && !order[1]);
          orders.push(newOrder);

          // Update orders in database
          await axios.post('http://localhost:5001/orders', orders);
          clearCart();
          navigate('/home');
        }
      })
      .catch(err => console.error('Error:', err));
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