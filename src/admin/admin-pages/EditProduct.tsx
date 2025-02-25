import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { checkAuth } from '../../utils/authUtils';

const EditProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    checkAuth();
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
        image
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
              <div className="product-details">
                <div className="detail-row">
                  <label>Current Product Details:</label>
                  <table className="details-table">
                    <tbody>
                      <tr>
                        <td><strong>Name:</strong></td>
                        <td>{name}</td>
                      </tr>
                      <tr>
                        <td><strong>Price:</strong></td>
                        <td>${price}</td>
                      </tr>
                      <tr>
                        <td><strong>Description:</strong></td>
                        <td>{description}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-box">
                <label>Update Name</label>
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
                <label>Update Price ($)</label>
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
                <label>Update Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-box">
                <label>Update Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
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
