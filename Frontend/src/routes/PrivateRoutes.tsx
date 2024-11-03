import { Alert, Center, Text, Title } from '@mantine/core';
import { useAuth } from 'contexts/AuthContext';
import {
  SuperAdminProfile,
  CompanyAdminProfile,
  WorkerProfile,
} from 'types/profileTypes.ts';

import CompanyAdmin from './roles/CompanyAdmin.tsx';
import SuperAdmin from './roles/SuperAdmin.tsx';
import Worker from './roles/Worker.tsx';

const PrivateRoutes = (): JSX.Element => {
  const {
    profile,
  }: {
    profile: SuperAdminProfile | CompanyAdminProfile | WorkerProfile;
  } = useAuth();

  if (profile.role === 'super_admin') {
    return <SuperAdmin />;
  }

  if (profile.role === 'company_admin') {
    return <CompanyAdmin />;
  }

  if (profile.role === 'worker') {
    return <Worker />;
  }

  return (
    <Center>
      <Alert color='red' title={<Title order={3}>Error</Title>}>
        <Text>Unauthorized access.</Text>
      </Alert>
    </Center>
  );
};

export default PrivateRoutes;
