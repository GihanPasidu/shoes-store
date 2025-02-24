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
}

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const { addToCart } = useCart();

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

  if (!shoe) return <div>Loading...</div>;

  return (
    <div className="product-page">
      <header className="header">
        <h1>BLUE TAG</h1>
      </header>
      <nav className="shortcut-bar">
        <Link to="/home">Home</Link> {/* Navigate to HomePage */}
        <Link to="/cart">Cart</Link>
      </nav>
      <img src={shoe.image} alt={shoe.name} />
      <h1>{shoe.name}</h1>
      <p>{shoe.description}</p>
      <p>{shoe.price}</p>
      <button onClick={() => addToCart(shoe.id.toString())}>Add to Cart</button>
      <footer className="footer">
        <p>&copy; 2023 GPK Solution</p>
      </footer>
    </div>
  );
};

export default ProductPage;
