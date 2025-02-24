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

  return (
    <div className="home-page">
      <header className="header">
        <h1>BLUE TAG</h1>
      </header>
      <nav className="shortcut-bar">
        <Link to="/cart">Cart</Link>
      </nav>
      <h1>Our Shoe Collection</h1>
      <div className="shoe-list">
        {shoes.map(shoe => (
          <div key={shoe.id} className="shoe-item">
            <img src={shoe.image} alt={shoe.name} onClick={() => handleViewDetails(shoe.id)} />
            <h3 onClick={() => handleViewDetails(shoe.id)}>{shoe.name}</h3>
            <p onClick={() => handleViewDetails(shoe.id)}>{shoe.price}</p>
            <button onClick={() => addToCart(shoe.id.toString())}>Add to Cart</button>
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
