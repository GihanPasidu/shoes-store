import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CartPage.css';

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
        <h1>BLUE TAG</h1>
      </header>
      <nav className="shortcut-bar">
        <Link to="/home">Home</Link> {/* Navigate to HomePage */}
      </nav>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>No items in cart yet.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="cart-item">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id.toString())}
                  onChange={() => handleSelectChange(item.id.toString())}
                />
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <Link to={`/product/${item.id}`}>{item.name}</Link>
                <p>{item.price}</p>
              </li>
            ))}
          </ul>
          <button className="remove-button" onClick={handleRemoveSelected}>Remove</button>
        </>
      )}
      <div className="total-price">
        <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
        <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
      </div>
      <footer className="footer">
        <p>&copy; 2023 GPK Solution</p>
      </footer>
    </div>
  );
};

export default CartPage;
