import { useState } from 'react';

import { Anchor, Paper, Stack, Stepper, Text, Title } from '@mantine/core';
import { useAuth } from 'contexts/AuthContext';
import { CompanyProfile } from 'types/generated';

import CompanyForm from './components/CompanyForm.tsx';
import ProfileUpdateForm from './components/ProfileUpdateForm.tsx';

const Activation = () => {
  const {
    logout,
    companyProfile,
  }: {
    logout: () => void;
    companyProfile: CompanyProfile | undefined;
  } = useAuth();

  const [active, setActive] = useState(companyProfile ? 1 : 0);

  return (
    <Paper
      shadow='2xl'
      radius='md'
      maw={520}
      p='xl'
      w='100%'
      m='0 auto'
      sx={{ position: 'relative', overflow: 'hidden' }}
    >
      <Stack spacing='xl'>
        <Title order={4} weight={700} align='center'>
          Fill in information
        </Title>
        <Stepper
          active={active}
          onStepClick={setActive}
          orientation='horizontal'
        >
          <Stepper.Step label='Company' description='Create a company'>
            <CompanyForm handleStepAhead={() => setActive(1)} />
          </Stepper.Step>
          <Stepper.Step label='Owner' description='Owner`s information'>
            <ProfileUpdateForm />
          </Stepper.Step>
        </Stepper>
        <Text align='center'>
          <Text>Already have an account?</Text>
          <Anchor fw={700} color='green' onClick={logout} underline>
            Log in
          </Anchor>
        </Text>
      </Stack>
    </Paper>
  );
};
export default Activation;