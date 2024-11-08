import Branches from 'pages/private/superadmin/Branches';
import Cart from 'pages/private/superadmin/Cart';
import Company from 'pages/private/superadmin/Company';
import CompanyList from 'pages/private/superadmin/CompanyList';
import Driver from 'pages/private/superadmin/Driver';
import DriverList from 'pages/private/superadmin/DriverList';
import Home from 'pages/private/superadmin/Home';
import Orders from 'pages/private/superadmin/Orders';
import Settings from 'pages/private/superadmin/Settings';
import Sort from 'pages/private/superadmin/Sort';
import Staffs from 'pages/private/superadmin/Staffs';
import Billing from 'pages/private/superadmin/Transactions';
import NotFound from 'pages/shared/NotFound';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RoutesMap } from 'routes/types';

export const ownerRoutesMap: RoutesMap = {
  '/login': <Navigate to='/' replace />,
  '/register': <Navigate to='/' replace />,
  '*': <NotFound />,
  '/': <Home />,
  '/companies': <CompanyList />,
  '/company/:id': <Company />,
  '/drivers': <DriverList />,
  '/drivers/:id': <Driver />,
  // '/orders': <Orders />,
  // '/branches': <Branches />,
  // '/staffs': <Staffs />,
  // '/cart': <Cart />,
  // '/settings': <Settings />,
  // // '/sorts/:id': <Sort />,
  // '/billing': <Billing />,
};

const Owner = () => {
  return (
    <Routes>
      {Object.keys(ownerRoutesMap).map((path) => (
        <Route key={path} path={path} element={ownerRoutesMap[path]} />
      ))}
    </Routes>
  );
};

export default Owner;
