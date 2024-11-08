import Cart from 'pages/private/superadmin/Cart';
import Home from 'pages/private/worker/Home';
import Orders from 'pages/private/superadmin/Orders';
import Driver from 'pages/private/worker/Driver';
import DriverList from 'pages/private/worker/DriverList';
import NotFound from 'pages/shared/NotFound';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RoutesMap } from 'routes/types';

export const staffRoutesMap: RoutesMap = {
  '/login': <Navigate to='/' replace />,
  '/register': <Navigate to='/' replace />,
  '*': <NotFound />,
  '/': <Home />,
  '/drivers': <DriverList />,
  '/drivers/:id': <Driver />,
  // '/orders': <Orders />,
  // '/cart': <Cart />,
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
