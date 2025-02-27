import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CartPage.css';

interface Shoe {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartItem extends Shoe {
  cartQuantity: number;
}

const CartPage: React.FC = () => {
  const { cart, removeFromCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [itemQuantities, setItemQuantities] = useState<{[key: string]: number}>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length > 0) {
      axios.get('http://localhost:5000/shoes')
        .then(response => {
          const shoes = response.data;
          // Count quantities of each item in cart
          const quantities = cart.reduce((acc: {[key: string]: number}, id: string) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
          }, {});
          setItemQuantities(quantities);

          // Create cart items with quantities
          const items = shoes
            .filter((shoe: Shoe) => cart.includes(shoe.id.toString()))
            .map((shoe: Shoe) => ({
              ...shoe,
              cartQuantity: quantities[shoe.id.toString()] || 0
            }));
          setCartItems(items);
        })
        .catch(err => console.error('Error fetching cart items:', err));
    } else {
      setCartItems([]);
      setItemQuantities({});
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems
      .filter(item => selectedItems.includes(item.id.toString()))
      .reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * (itemQuantities[item.id.toString()] || 0));
      }, 0);
    setTotalPrice(total);
  }, [selectedItems, cartItems, itemQuantities]);

  const handleSelectChange = (id: string) => {
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter(item => item !== id)
        : [...prevSelectedItems, id]
    );
  };

  const handleCheckout = () => {
    navigate('/checkout', { 
      state: { totalAmount: totalPrice }
    });
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
          <div className="header-right">
            <Link to="/profile" className="profile-link">
              <i className="fas fa-user"></i>
            </Link>
            <Link to="/cart" className="cart-link">
              <i className="fas fa-shopping-cart"></i>
            </Link>
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
                      <p className="item-price">{item.price}</p>
                      <p className="quantity-text">
                        Quantity in Cart: {itemQuantities[item.id.toString()] || 0}
                      </p>
                      <p className="item-total">
                        Item Total: ${((parseFloat(item.price.replace('$', ''))) * 
                          (itemQuantities[item.id.toString()] || 0)).toFixed(2)}
                      </p>
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
            <p>Total Items: {Object.values(itemQuantities)
              .filter((_, index) => selectedItems.includes(cartItems[index]?.id.toString()))
              .reduce((a, b) => a + b, 0)}
            </p>
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
