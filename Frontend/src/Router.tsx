import React, { useEffect } from 'react';

import { Notifications } from '@mantine/notifications';
import ErrorBoundary from 'components/states/ErrorBoundary';

import { useAuth } from './contexts/AuthContext.tsx';
import Loading from './pages/shared/Loading.tsx';
import ServerError from './pages/shared/ServerError.tsx';
import PrivateLayout from './routes/layouts/PrivateLayout';
import PublicLayout from './routes/layouts/PublicLayout.tsx';
import { UserProfile } from './types/profileTypes.ts';

const Router = (): JSX.Element => {
  const {
    isLoading,
    isAuthenticated,
    profile,
  }: {
    isLoading: boolean;
    isAuthenticated: boolean;
    profile: UserProfile;
  } = useAuth();

  const loadAuthenticatedRouter = (): any => import('routes/PrivateRoutes');
  const PrivateRoutes = React.lazy(loadAuthenticatedRouter);
  const PublicRoutes = React.lazy(() => import('routes/PublicRoutes'));

  useEffect(() => {
    loadAuthenticatedRouter();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const Layout = (() => {
    if (!!profile) {
      return PrivateLayout;
    }

    return PublicLayout;
  })();

  return (
    <ErrorBoundary errorMessage={<ServerError />}>
      <Notifications position='top-right' />
      <Layout>
        <React.Suspense fallback={<Loading />}>
          {isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
        </React.Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

export default Router;
