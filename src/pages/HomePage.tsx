import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import { useCart } from '../context/CartContext';

interface Shoe {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

const HomePage: React.FC = () => {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredShoes, setFilteredShoes] = useState<Shoe[]>([]);
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  useEffect(() => {
    axios.get('http://localhost:5000/shoes')
      .then(response => {
        setShoes(response.data);
        setFilteredShoes(response.data);
      })
      .catch(err => console.error('Error fetching shoes:', err));
  }, []);

  useEffect(() => {
    const filtered = shoes.filter(shoe =>
      shoe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shoe.price.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredShoes(filtered);
  }, [searchQuery, shoes]);

  const handleViewDetails = (id: number) => {
    navigate(`/product/${id}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="home-page">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/home" className="logo">BLUE TAG</Link>
            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
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
      <h1>Our Shoe Collection</h1>
      <div className="shoe-list">
        {filteredShoes.map(shoe => (
          <div key={shoe.id} className="shoe-item">
            <div className="shoe-item-content">
              <Link to={`/product/${shoe.id}`}>
                <img src={shoe.image} alt={shoe.name} />
                <div className="shoe-item-details">
                  <h3>{shoe.name}</h3>
                  <p>{shoe.price}</p>
                  <p className="quantity-text">Available: {shoe.quantity}</p>
                </div>
              </Link>
              <button 
                onClick={() => {
                  const currentCartCount = cart.filter(id => id === shoe.id.toString()).length;
                  if (currentCartCount >= shoe.quantity) {
                    return;
                  }
                  addToCart(shoe.id.toString());
                }}
                disabled={shoe.quantity === 0}
              >
                {shoe.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <footer className="footer">
        <p>&copy; 2023 GPK Solution</p>
      </footer>
    </div>
  );
};

export default HomePage;
