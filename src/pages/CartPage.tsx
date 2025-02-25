import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/CartPage.css';

interface Shoe {
  id: number;
  name: string;
  price: string;
  image: string;
}

const CartPage: React.FC = () => {
  const { cart, removeFromCart } = useCart();
  const [cartItems, setCartItems] = useState<Shoe[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (cart.length > 0) {
      axios.get('http://localhost:5000/shoes')
        .then(response => {
          const shoes = response.data;
          const items = shoes.filter((shoe: Shoe) => cart.includes(shoe.id.toString()));
          setCartItems(items);
        })
        .catch(err => console.error('Error fetching cart items:', err));
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems
      .filter(item => selectedItems.includes(item.id.toString()))
      .reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0);
    setTotalPrice(total);
  }, [selectedItems, cartItems]);

  const handleSelectChange = (id: string) => {
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter(item => item !== id)
        : [...prevSelectedItems, id]
    );
  };

  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id.toString()));
    console.log('Checking out the following items:', selectedCartItems);
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach(id => removeFromCart(id));
    setSelectedItems([]);
    setCartItems(prevCartItems => prevCartItems.filter(item => !selectedItems.includes(item.id.toString())));
  };

  return (
    <div className="cart-page">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/home" className="logo">BLUE TAG</Link>
          </div>
        </div>
      </header>
      <nav className="shortcut-bar">
        <Link to="/home">Home</Link>
      </nav>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <Link to="/home" className="checkout-button">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-container">
            <div className="cart-items-wrapper">
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <input
                      type="checkbox"
                      className="cart-item-checkbox"
                      checked={selectedItems.includes(item.id.toString())}
                      onChange={() => handleSelectChange(item.id.toString())}
                    />
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p>{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="remove-selected-button"
                onClick={handleRemoveSelected}
                disabled={selectedItems.length === 0}
              >
                Remove Selected
              </button>
            </div>
          </div>
          <div className="checkout-section">
            <h2>Order Summary</h2>
            <p>Selected Items: {selectedItems.length}</p>
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button 
              className="checkout-button" 
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
      <footer className="footer">
        <p>&copy; 2023 GPK Solution</p>
      </footer>
    </div>
  );
};

export default CartPage;
