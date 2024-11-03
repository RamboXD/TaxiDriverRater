import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  Group,
  rem,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
  root: {
    height: '100%',
    display: ' flex',
    flexFlow: 'column',
    alignItems: ' center',
    justifyContent: 'center',

    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(220),
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(120),
    },
  },

  title: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(500),
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
}));

const NotFound = (): JSX.Element => {
  const { classes } = useStyles();

  const navigate = useNavigate();

  const handleNavigateToHome = () => {
    navigate('/');
  };

  return (
    <Container className={classes.root}>
      <Title className={classes.label}>404</Title>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text
        color='dimmed'
        size='lg'
        align='center'
        className={classes.description}
      >
        Unfortunately, this is only a 404 page. You may have mistyped the
        address, or the page has been moved to another URL.
      </Text>
      <Group position='center'>
        <Button variant='subtle' size='md' onClick={handleNavigateToHome}>
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
};

export default NotFound;
