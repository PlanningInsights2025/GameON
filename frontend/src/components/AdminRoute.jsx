import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/admin-login" state={{ from: location, message: 'Please login as admin to access admin panel' }} replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" replace state={{ message: "You don't have permission to access the admin panel." }} />;
  }
  
  return children;
}
