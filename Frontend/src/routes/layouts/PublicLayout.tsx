import React from 'react';

import { Container, createStyles, Image } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    gap: `calc(${theme.spacing.xl} * 2)`,
    padding: `${theme.spacing.xl} ${theme.spacing.md}`,
  },
}));

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Container maw={520}>
        {/* <Image
          src='/images/logo/logo-green.png'
          alt='fresh-market-logo'
          height={28}
          fit='contain'
        /> */}
      </Container>
      {children}
    </div>
  );
};

export default PublicLayout;
