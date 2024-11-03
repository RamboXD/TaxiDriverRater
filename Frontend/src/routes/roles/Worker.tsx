import Cart from 'pages/private/owner/Cart';
import Home from 'pages/private/owner/Home';
import Orders from 'pages/private/owner/Orders';
import NotFound from 'pages/shared/NotFound';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RoutesMap } from 'routes/types';

export const staffRoutesMap: RoutesMap = {
  '/login': <Navigate to='/' replace />,
  '/register': <Navigate to='/' replace />,
  '*': <NotFound />,
  '/': <Home />,
  '/orders': <Orders />,
  '/cart': <Cart />,
};

const Staff = () => {
  return (
    <Routes>
      {Object.keys(staffRoutesMap).map((path) => (
        <Route key={path} path={path} element={staffRoutesMap[path]} />
      ))}
    </Routes>
  );
};

export default Staff;
