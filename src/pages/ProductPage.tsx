import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProductPage.css';
import { useCart } from '../context/CartContext';

interface Shoe {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  quantity: number;
}

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    if (id) {
      axios.get('http://localhost:5000/shoes')
        .then(response => {
          const shoeData = response.data.find((shoe: Shoe) => shoe.id.toString() === id);
          setShoe(shoeData);
        })
        .catch(err => console.error('Error fetching shoe details:', err));
    }
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuantity(parseInt(e.target.value));
  };

  if (!shoe) return <div>Loading...</div>;

  return (
    <div className="product-page">
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
      <div className="product-container">
        <div className="product-image">
          <img src={shoe.image} alt={shoe.name} />
        </div>
        <div className="product-details">
          <h1>{shoe.name}</h1>
          <p>{shoe.description}</p>
          <p className="price">{shoe.price}</p>
          <p className="quantity">Available Quantity: {shoe.quantity}</p>
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity: </label>
            <select 
              id="quantity"
              value={selectedQuantity}
              onChange={handleQuantityChange}
              disabled={shoe.quantity === 0}
            >
              {Array.from({length: shoe.quantity}, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <button 
            className="add-to-cart-btn"
            onClick={() => {
              const currentCartCount = cart.filter(itemId => itemId === shoe.id.toString()).length;
              const remainingStock = shoe.quantity - currentCartCount;

              if (selectedQuantity > remainingStock || currentCartCount >= shoe.quantity) {
                return;
              }
              for(let i = 0; i < selectedQuantity; i++) {
                addToCart(shoe.id.toString());
              }
            }}
            disabled={shoe.quantity === 0}
          >
            {shoe.quantity > 0 ? `Add ${selectedQuantity} to Cart` : 'Out of Stock'}
          </button>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2023 GPK Solution</p>
      </footer>
    </div>
  );
};

export default ProductPage;
