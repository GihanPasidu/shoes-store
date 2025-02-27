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

  const checkExpiredHolds = async () => {
    try {
      const ordersResponse = await axios.get('http://localhost:5001/orders');
      const orders = ordersResponse.data;
      const now = new Date();

      const expiredOrders = orders.filter((order: any) => 
        order.status === 'pending' && 
        order.pickupDeadline && 
        new Date(order.pickupDeadline) < now
      );

      if (expiredOrders.length > 0) {
        // Get current shoes data
        const shoesResponse = await axios.get('http://localhost:5000/shoes');
        let shoes = shoesResponse.data;

        // Restore quantities from expired orders
        expiredOrders.forEach((order: any) => {
          const quantities = order.items.reduce((acc: {[key: string]: number}, id: string) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
          }, {});

          shoes = shoes.map((shoe: any) => {
            if (quantities[shoe.id.toString()]) {
              return {
                ...shoe,
                quantity: shoe.quantity + quantities[shoe.id.toString()]
              };
            }
            return shoe;
          });
        });

        // Update individual shoes in db.json
        for (const shoe of shoes) {
          await axios.patch(`http://localhost:5000/shoes/${shoe.id}`, shoe);
        }

        // Refresh the shoes list in the UI
        setShoes(shoes);
        setFilteredShoes(shoes);

        // Remove expired orders
        const updatedOrders = orders.filter((order: any) => 
          !expiredOrders.find((eo: any) => eo.orderId === order.orderId)
        );

        await axios.post('http://localhost:5001/orders', updatedOrders);
      }
    } catch (err) {
      console.error('Error checking expired holds:', err);
    }
  };

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

  useEffect(() => {
    // Check for expired holds when component mounts
    checkExpiredHolds();
    
    // Set up interval to check periodically
    const interval = setInterval(checkExpiredHolds, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

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
