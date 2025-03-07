import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/CheckoutPage.css';
import axios from 'axios';

interface CheckoutProps {
  totalAmount?: number;
}

type PaymentMethod = 'online' | 'pickup';
type PaymentStatus = 'paid' | 'hold';
type StorePayment = 'card' | 'store';

const CheckoutPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalAmount } = location.state as CheckoutProps;
  const { clearCart, cart } = useCart();
  const userEmail = localStorage.getItem('userEmail');

  const handlePaymentSelection = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const updateShoeQuantities = async (items: string[]) => {
    try {
      const response = await axios.get('http://localhost:5000/shoes');
      const shoes = response.data;
      
      const quantities = items.reduce((acc: {[key: string]: number}, id: string) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});

      const updatedShoes = shoes.map((shoe: any) => {
        if (quantities[shoe.id.toString()]) {
          return {
            ...shoe,
            quantity: shoe.quantity - quantities[shoe.id.toString()]
          };
        }
        return shoe;
      });

      // Update individual shoes in db.json
      for (const shoe of updatedShoes) {
        if (quantities[shoe.id.toString()]) {
          await axios.patch(`http://localhost:5000/shoes/${shoe.id}`, shoe);
        }
      }

      return true;
    } catch (err) {
      console.error('Error updating shoe quantities:', err);
      return false;
    }
  };

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    if (paymentMethod === 'pickup') {
      axios.get('http://localhost:5001/users')
        .then(async response => {
          // Get all orders to find the last order number
          const ordersRes = await axios.get('http://localhost:5001/orders');
          const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
          const lastOrderNum = orders.length > 0 
            ? parseInt(orders[orders.length - 1].orderId.replace('ORD', ''))
            : 0;

          const user = response.data.find((u: any) => u.email === userEmail);
          if (user) {
            await updateShoeQuantities(cart);

            const pickupDeadline = new Date();
            pickupDeadline.setDate(pickupDeadline.getDate() + 1);
            pickupDeadline.setHours(20, 0, 0, 0);

            const newOrder = {
              orderId: `ORD${lastOrderNum + 1}`,
              id: user.id,
              items: cart,
              totalAmount: totalAmount,
              paymentMethod: 'store' as StorePayment,
              status: 'hold' as PaymentStatus,
              date: new Date().toISOString(),
              pickupDeadline: pickupDeadline.toISOString()
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
    } else if (paymentMethod === 'online') {
      navigate('/payment', { state: { amount: totalAmount } });
    }
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