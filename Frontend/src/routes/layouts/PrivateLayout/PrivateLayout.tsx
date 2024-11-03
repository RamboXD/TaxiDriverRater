import React from 'react';

import { AppShell, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import Header from './components/Header.tsx';
import Navbar from './components/Navbar.tsx';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  const [opened, { toggle }] = useDisclosure(false);
  console.log('====================================');
  console.log('here');
  console.log('====================================');
  return (
    <AppShell
      padding='md'
      navbar={<Navbar opened={opened} />}
      header={<Header opened={opened} toggle={toggle} />}
    >
      <Container fluid py='xl'>
        {children}
      </Container>
    </AppShell>
  );
};

export default PrivateLayout;
