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
}

const HomePage: React.FC = () => {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('http://localhost:5000/shoes')
      .then(response => setShoes(response.data))
      .catch(err => console.error('Error fetching shoes:', err));
  }, []);

  const handleViewDetails = (id: number) => {
    navigate(`/product/${id}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
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
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
          <div className="header-right">
            <Link to="/cart" className="cart-link">
              <i className="fas fa-shopping-cart"></i>
            </Link>
          </div>
        </div>
      </header>
      <h1>Our Shoe Collection</h1>
      <div className="shoe-list">
        {shoes.map(shoe => (
          <div key={shoe.id} className="shoe-item">
            <div className="shoe-item-content">
              <Link to={`/product/${shoe.id}`}>
                <img src={shoe.image} alt={shoe.name} />
                <div className="shoe-item-details">
                  <h3>{shoe.name}</h3>
                  <p>{shoe.price}</p>
                </div>
              </Link>
              <button onClick={() => addToCart(shoe.id.toString())}>
                Add to Cart
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
