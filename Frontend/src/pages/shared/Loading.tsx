import { createStyles, Loader } from '@mantine/core';

const useStyles = createStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
}));

const Loading = (): JSX.Element => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Loader variant='dots' />
    </div>
  );
};

export default Loading;
