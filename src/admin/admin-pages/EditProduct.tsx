import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../admin-styles/EditProduct.css';

const EditProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState(0);

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/shoes/${id}`);
        const product = response.data;
        setName(product.name);
        setPrice(product.price.replace('$', ''));
        setDescription(product.description);
        setImage(product.image);
        setQuantity(product.quantity);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/shoes/${id}`, {
        name,
        price: `$${price}`,
        description,
        image,
        quantity
      });
      navigate('/admin');
    } catch (error) {
      console.error('Error updating product:', error);
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
          <form onSubmit={handleSubmit} className="edit-product-form">
            <h2>Edit Product</h2>
            <div className="edit-product-current">
              <img src={image} alt={name} className="product-preview" />
              <div className="current-details">
                <p><strong>Current Name:</strong> {name}</p>
                <p><strong>Current Price:</strong> ${price}</p>
                <p><strong>Current Description:</strong> {description}</p>
              </div>
            </div>

            <div className="input-group">
              <div className="input-box">
                <label>New Name <span className="current-value">Current: {name}</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-box">
                <label>New Price <span className="current-value">Current: ${price}</span></label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-box">
                <label>New Description</label>
                <div className="current-value">Current: {description}</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-box">
                <label>New Image URL</label>
                <div className="current-value">Current: {image}</div>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-box">
                <label>New Quantity <span className="current-value">Current: {quantity}</span></label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="0"
                  required
                />
              </div>
            </div>

            <button type="submit">Update Product</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditProduct;
