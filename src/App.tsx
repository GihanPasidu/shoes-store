import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import SignUpPage from './pages/SignUpPage'; // Import SignUpPage
import LoginPage from './pages/LoginPage'; // Import LoginPage

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignUpPage />} /> {/* Show SignUpPage first */}
          <Route path="/signup" element={<SignUpPage />} /> {/* Ensure SignUpPage route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
