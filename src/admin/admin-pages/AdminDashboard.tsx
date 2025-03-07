import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../admin-styles/AdminDashboard.css';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  quantity: number;
}

interface User {
  id: string;
  email: string;
  role: string;
}

interface Order {
  orderId: string;
  id: string;
  items: string[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  date: string;
  pickupDeadline: string;
  itemDetails?: Product[];
}

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number | string, type: 'product' | 'user' | 'order' } | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const itemsPerPage = 8;

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
    fetchProducts();
    fetchUsers();
    fetchOrders();
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
      // Show all users instead of filtering
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5001/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleDeleteClick = (id: number | string, type: 'product' | 'user' | 'order') => {
    setItemToDelete({ id, type });
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'product') {
        await axios.delete(`http://localhost:5000/shoes/${itemToDelete.id}`);
        fetchProducts();
      } else if (itemToDelete.type === 'user') {
        await axios.delete(`http://localhost:5001/users/${itemToDelete.id}`);
        fetchUsers();
      } else {
        await axios.delete(`http://localhost:5001/orders/${itemToDelete.id}`);
        fetchOrders();
      }
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.type}:`, error);
    }
    
    setShowConfirmDialog(false);
    setItemToDelete(null);
  };

  const handleViewOrderDetails = async (order: Order) => {
    try {
      // Fetch product details for each item in the order
      const itemDetails = await Promise.all(
        order.items.map(async (itemId) => {
          const response = await axios.get(`http://localhost:5000/shoes/${itemId}`);
          return response.data;
        })
      );
      setSelectedOrder({ ...order, itemDetails });
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
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

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <Link to="/admin" className="logo">BLUE TAG ADMIN</Link>
          <nav className="admin-nav">
            <Link to="/home">View Store</Link>
            <button onClick={handleLogout}>Logout</button>
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
            <button 
              className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
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
                          <p>Stock: {product.quantity}</p>
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
          ) : activeTab === 'users' ? (
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
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Role</th>
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
                          </div>
                        </td>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <div className="user-actions">
                            <button className="view-button">View Details</button>
                            <button 
                              className="delete-button"
                              onClick={() => handleDeleteClick(user.id, 'user')}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'orders' ? (
            <div className="orders-section">
              <div className="section-header">
                <h2>Orders Management</h2>
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(order => order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(order => (
                        <tr key={order.orderId}>
                          <td>{order.orderId}</td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>{order.items.length} items</td>
                          <td>${order.totalAmount}</td>
                          <td>
                            <div className="payment-info">
                              <span className={`payment-card${order.paymentMethod.toLowerCase()}`}>
                                {order.paymentMethod.toUpperCase()}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className={`status-${order.status.toLowerCase()}`}>
                              {order.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <div className="user-actions">
                              <button 
                                className="view-button"
                                onClick={() => handleViewOrderDetails(order)}
                              >
                                Details
                              </button>
                              <button 
                                className="delete-button"
                                onClick={() => handleDeleteClick(order.orderId, 'order')}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
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
      {showLogoutDialog && (
        <div className="logout-dialog-overlay">
          <div className="logout-dialog">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-dialog-buttons">
              <button className="confirm-logout" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button className="cancel-logout" onClick={() => setShowLogoutDialog(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedOrder && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog order-details-dialog">
            <h3>Order Details</h3>
            <div className="order-details">
              <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(selectedOrder.date).toLocaleTimeString()}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
              <p><strong>Status:</strong> <span className={`status-${selectedOrder.status}`}>{selectedOrder.status}</span></p>
              <p><strong>Pickup Deadline:</strong> {new Date(selectedOrder.pickupDeadline).toLocaleString()}</p>
              
              <div className="order-items">
                <h4>Items:</h4>
                {selectedOrder.itemDetails?.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <p><strong>Name:</strong> {item.name}</p>
                      <p><strong>Price:</strong> {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="total-amount"><strong>Total Amount:</strong> ${selectedOrder.totalAmount}</p>
            </div>
            <div className="confirm-dialog-buttons">
              <button className="cancel-delete" onClick={() => setSelectedOrder(null)}>Close</button>
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
