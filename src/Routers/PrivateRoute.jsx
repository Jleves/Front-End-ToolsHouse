import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; 


export const PrivateRoute = () => {

 const { isLogged, user } = useAuth();
  let isAdmin = false
 if (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') {
  isAdmin = true;
 }

 console.log(isAdmin);
  
  return isLogged && isAdmin ? <Outlet /> : <Navigate to="/" />;
  
};

