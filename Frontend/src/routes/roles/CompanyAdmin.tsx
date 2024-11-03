import Billing from 'pages/private/farmer/Billing';
import Farms from 'pages/private/farmer/Farms';
import Home from 'pages/private/farmer/Home';
import OrderItems from 'pages/private/farmer/OrderItems';
import Orders from 'pages/private/farmer/Orders';
import Settings from 'pages/private/farmer/Settings';
import Sort from 'pages/private/farmer/Sort';
import NotFound from 'pages/shared/NotFound';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RoutesMap } from 'routes/types';

export const farmerRoutesMap: RoutesMap = {
  '/login': <Navigate to='/' replace />,
  '/register': <Navigate to='/' replace />,
  '*': <NotFound />,
  '/': <Home />,
  '/farms': <Farms />,
  '/billing': <Billing />,
  '/orders': <Orders />,
  '/order_items': <OrderItems />,
  '/settings': <Settings />,
  '/sorts/:id': <Sort />,
  // '/login': <Navigate to='/' replace />,
  // '/register': <Navigate to='/' replace />,
};

const Farmer = () => {
  return (
    <Routes>
      {Object.keys(farmerRoutesMap).map((path) => (
        <Route key={path} path={path} element={farmerRoutesMap[path]} />
      ))}
    </Routes>
  );
};

export default Farmer;
