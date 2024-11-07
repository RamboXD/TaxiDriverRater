import Branches from 'pages/private/owner/Branches';
import Cart from 'pages/private/owner/Cart';
import Company from 'pages/private/owner/Company';
import CompanyList from 'pages/private/owner/CompanyList';
import Home from 'pages/private/owner/Home';
import Orders from 'pages/private/owner/Orders';
import Settings from 'pages/private/owner/Settings';
import Sort from 'pages/private/owner/Sort';
import Staffs from 'pages/private/owner/Staffs';
import Billing from 'pages/private/owner/Transactions';
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
  '/orders': <Orders />,
  '/branches': <Branches />,
  '/staffs': <Staffs />,
  '/cart': <Cart />,
  '/settings': <Settings />,
  '/sorts/:id': <Sort />,
  '/billing': <Billing />,
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
