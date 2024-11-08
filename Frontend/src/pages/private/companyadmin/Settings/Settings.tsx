import { useState } from 'react';

import {
  Box,
  Center,
  Divider,
  Flex,
  SegmentedControl,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconFileText, IconUser } from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';

import GeneralCard from './components/GeneralCard.tsx';

const Settings = () => {
  const theme = useMantineTheme();

  const [activeTab, setActiveTab] = useState('general');

  return (
    <Stack spacing='xl'>
      <Flex direction='column'>
        <Title weight={700}>Settings</Title>
        <Text color='dimmed'>
          Account, general, billing, terms and privacy policy settings
        </Text>
      </Flex>

      <Divider />

      <SegmentedControl
        value={activeTab}
        onChange={setActiveTab}
        color='green'
        fullWidth
        data={[
          {
            value: 'general',
            label: (
              <Center w='auto'>
                <IconUser size={theme.fontSizes.md} />
                <Box ml={10}>General</Box>
              </Center>
            ),
          },
          {
            value: 'terms',
            label: (
              <Center w='auto'>
                <IconFileText size={theme.fontSizes.md} />
                <Box ml={10}>Terms & Policy</Box>
              </Center>
            ),
          },
        ]}
      />

      {activeTab === 'general' && <GeneralCard />}

      {(activeTab === 'billing' || activeTab === 'terms') && (
        <EmptyState
          title='In development'
          description='This section is in development'
        />
      )}
    </Stack>
  );
};

export default Settings;
