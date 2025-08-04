import { Navigate } from 'react-router-dom';

//Protection from other parts of website if token doesnt exist
//Can be ignored if user creates own token but they cant get access to any information that way
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;