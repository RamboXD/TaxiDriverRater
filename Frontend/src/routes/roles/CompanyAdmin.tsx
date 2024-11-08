import Billing from 'pages/private/companyadmin/Billing';
import Company from 'pages/private/companyadmin/Company';
import Driver from 'pages/private/companyadmin/Driver';
import DriverList from 'pages/private/companyadmin/DriverList';
import Farms from 'pages/private/companyadmin/Farms';
import Home from 'pages/private/companyadmin/Home';
import OrderItems from 'pages/private/companyadmin/OrderItems';
import Orders from 'pages/private/companyadmin/Orders';
import Settings from 'pages/private/companyadmin/Settings';
import Sort from 'pages/private/companyadmin/Sort';
import NotFound from 'pages/shared/NotFound';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RoutesMap } from 'routes/types';

export const farmerRoutesMap: RoutesMap = {
  '/login': <Navigate to='/' replace />,
  '/register': <Navigate to='/' replace />,
  '*': <NotFound />,
  '/': <Home />,
  '/company': <Company />,
  '/drivers': <DriverList />,
  '/drivers/:id': <Driver />,
  // '/farms': <Farms />,
  // '/billing': <Billing />,
  // '/orders': <Orders />,
  // '/order_items': <OrderItems />,
  // '/settings': <Settings />,
  // '/sorts/:id': <Sort />,
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
