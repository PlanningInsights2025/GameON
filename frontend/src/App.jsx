import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SportsPage from './pages/SportsPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import AddressPage from './pages/AddressPage';
import SupportPage from './pages/SupportPage';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminSports from './admin/AdminSports';
import AdminDisciplines from './admin/AdminDisciplines';

import AdminProducts from './admin/AdminProducts';
import AdminUsers from './admin/AdminUsers';
import AdminOrders from './admin/AdminOrders';
import AdminBanners from './admin/AdminBanners';
import AdminSettings from './admin/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
        <Route path="/index.html" element={<><Navbar /><HomePage /><Footer /></>} />
        <Route path="/index.html/admin-login" element={<Navigate to="/admin-login" replace />} />
        <Route path="/index.html/admin/*" element={<Navigate to="/admin" replace />} />
        <Route path="/sports" element={<><Navbar /><SportsPage /><Footer /></>} />
        <Route path="/products" element={<><Navbar /><ProductsPage /><Footer /></>} />
        <Route path="/products/:id" element={<><Navbar /><ProductDetailPage /><Footer /></>} />
        <Route path="/cart" element={<><Navbar /><CartPage /><Footer /></>} />
        <Route path="/wishlist" element={<><Navbar /><WishlistPage /><Footer /></>} />
        <Route path="/login" element={<><Navbar /><LoginPage /><Footer /></>} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/register" element={<><Navbar /><RegisterPage /><Footer /></>} />
        <Route path="/support" element={<><Navbar /><SupportPage /><Footer /></>} />

        {/* Protected user routes */}
        <Route path="/checkout" element={<ProtectedRoute><Navbar /><CheckoutPage /><Footer /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Navbar /><OrdersPage /><Footer /></ProtectedRoute>} />
        <Route path="/address" element={<ProtectedRoute><Navbar /><AddressPage /><Footer /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="sports" element={<AdminSports />} />
          <Route path="disciplines" element={<AdminDisciplines />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
