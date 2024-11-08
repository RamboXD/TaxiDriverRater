import { useState } from 'react';

import { Anchor, Paper, Stack, Stepper, Text, Title } from '@mantine/core';
import { useAuth } from 'contexts/AuthContext';
import { GmOwnerProfile } from 'types/generated';

import GrossmartForm from './components/GrossmartForm';
import ProfileUpdateForm from './components/ProfileUpdateForm';

const Activation = () => {
  const {
    logout,
    farmerProfile,
  }: {
    logout: () => void;
    farmerProfile: GmOwnerProfile | undefined;
  } = useAuth();

  const [active, setActive] = useState(farmerProfile?.firstName.length && farmerProfile.lastName.length ? 1 : 0);

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
          <Stepper.Step label='Owner' description='Owner Information'>
            <ProfileUpdateForm handleStepAhead={() => setActive(1)} />
          </Stepper.Step>
          <Stepper.Step label='Wholesaler' description='Wholesaler Information'>
            <GrossmartForm />
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