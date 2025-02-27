import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../admin-styles/AddProduct.css';

const AddProduct: React.FC = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      window.location.href = '/login';
      return;
    }

    if (role !== 'admin') {
      window.location.href = '/home';
      return;
    }
  }, []);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/shoes', {
        name,
        price: `$${price}`,
        description,
        image,
        quantity: Number(quantity)
      });
      navigate('/admin');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <Link to="/admin" className="logo">BLUE TAG ADMIN</Link>
          <nav className="admin-nav">
            <Link to="/home">View Store</Link>
            <button onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}>Logout</button>
          </nav>
        </div>
      </header>

      <div className="admin-container">
        <main className="admin-content full-width">
          <form onSubmit={handleSubmit} className="add-product-form">
            <h2>Add New Product</h2>
            {image && (
              <div className="edit-product-current">
                <img src={image} alt="Preview" className="product-preview" style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  marginBottom: '1rem',
                  borderRadius: '8px'
                }}/>
              </div>
            )}
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="url"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              required
            />
            <button type="submit">Add Product</button>
          </form>
        </main>
      </div>
      <footer className="admin-footer">
        <p>&copy; {new Date().getFullYear()} GPK Solution. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AddProduct;
