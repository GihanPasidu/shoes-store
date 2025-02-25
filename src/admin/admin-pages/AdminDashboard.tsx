import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../admin-styles/AdminDashboard.css';
import { checkAuth } from '../../utils/authUtils';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
}

interface User {
  id: string;
  email: string;
}

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number | string, type: 'product' | 'user' } | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  /*
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarExpanded(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  */

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/shoes');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteClick = (id: number | string, type: 'product' | 'user') => {
    setItemToDelete({ id, type });
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'product') {
        await axios.delete(`http://localhost:5000/shoes/${itemToDelete.id}`);
        fetchProducts();
      } else {
        await axios.delete(`http://localhost:5001/users/${itemToDelete.id}`);
        fetchUsers();
      }
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.type}:`, error);
    }
    
    setShowConfirmDialog(false);
    setItemToDelete(null);
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const renderPagination = () => {
    return (
      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
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

      <button 
        className={`sidebar-toggle ${isSidebarCollapsed ? 'collapsed' : ''}`}
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        {isSidebarCollapsed ? '►' : '◄'}
      </button>

      <div className="admin-container">
        <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-buttons">
            <button 
              className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button 
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
          </div>
          <Link to="/admin/add" className="add-product-button">
            Add New Product
          </Link>
        </aside>

        <main className={`admin-content ${isSidebarCollapsed ? 'full-width' : ''}`}>
          {activeTab === 'products' ? (
            <div className="products-section">
              <div className="section-header">
                <h2>Products Management</h2>
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <>
                  <div className="products-grid">
                    {currentProducts.map(product => (
                      <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.name} />
                        <div className="product-info">
                          <h3>{product.name}</h3>
                          <p>{product.price}</p>
                          <div className="product-actions">
                            <Link to={`/admin/edit/${product.id}`}>Edit</Link>
                            <button onClick={() => handleDeleteClick(product.id, 'product')}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {renderPagination()}
                </>
              )}
            </div>
          ) : (
            <div className="users-section">
              <div className="section-header">
                <h2>Users Management</h2>
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <div className="users-table-container">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">
                                {getInitials(user.email)}
                              </div>
                              <div className="user-email">{user.email}</div>
                            </div>
                          </td>
                          <td>{user.id}</td>
                          <td>{user.email}</td>
                          <td>
                            <div className="user-actions">
                              <button 
                                className="delete-button"
                                onClick={() => handleDeleteClick(user.id, 'user')}
                              >
                                Delete User
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.</p>
            <div className="confirm-dialog-buttons">
              <button className="confirm-delete" onClick={handleConfirmDelete}>Delete</button>
              <button className="cancel-delete" onClick={() => setShowConfirmDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <footer className="admin-footer">
        <p>&copy; {new Date().getFullYear()} GPK Solution. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
