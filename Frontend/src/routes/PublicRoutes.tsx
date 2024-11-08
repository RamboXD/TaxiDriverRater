import LoginBroker from 'pages/public/LoginBroker';
import LoginBusiness from 'pages/public/LoginBusiness';
import LoginFarmer from 'pages/public/LoginFarmer';
import RegisterBusiness from 'pages/public/RegisterBusiness';
import RegisterFarmer from 'pages/public/RegisterFarmer';
import { Navigate, Route, Routes } from 'react-router-dom';

import { RoutesMap } from './types';

export const publicRoutesMap: RoutesMap = {
  '/login': <LoginFarmer />,
  // '/login/farmer': <LoginFarmer />,
  // '/login/business': <LoginBusiness />,
  // '/login/broker': <LoginBroker />,
  // '/register/business': <RegisterBusiness />,
  // '/register/farmer': <RegisterFarmer />,
  '*': <Navigate to='/login' />,
};

const PublicRoutes = (): JSX.Element => {
  return (
    <Routes>
      {Object.keys(publicRoutesMap).map((path) => (
        <Route key={path} path={path} element={publicRoutesMap[path]} />
      ))}
    </Routes>
  );
};

export default PublicRoutes;
