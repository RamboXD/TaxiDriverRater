import {
  Button,
  Group,
  Image,
  Navbar as MantineNavbar,
  MediaQuery,
  Stack,
  Title,
  createStyles,
  getStylesRef,
  rem,
  useMantineTheme,
  Badge,
} from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useAuth } from 'contexts/AuthContext';
import useCurrentRoute from 'hooks/useCurrentRoute';
import useNavbarLinks from 'hooks/useNavbarLinks';
import { Link } from 'react-router-dom';
import { UserProfile } from 'types/profileTypes';

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${theme.colors.gray[2]}`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.colors.gray[2]}`,
  },

  link: {
    ...theme.fn.focusStyles(),

    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.md,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colors.gray[0],
      color: theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.colors.green[7],
      color: theme.colors.gray[0],
      [`& .${getStylesRef('icon')}`]: {
        color: theme.white,
      },
    },
  },
}));

interface NavbarProps {
  opened: boolean;
}

const Navbar = ({ opened }: NavbarProps) => {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  const { profile, logout }: { profile: UserProfile; logout: () => void } =
    useAuth();
  profile.company?.ID;
  const currentPathname = useCurrentRoute();
  const navbarLinks = useNavbarLinks(profile.role);

  const links = navbarLinks.map(({ label, path, Icon }) => (
    <Link
      key={label}
      to={path}
      className={cx(classes.link, {
        [classes.linkActive]: path === currentPathname,
      })}
    >
      <Icon
        className={classes.linkIcon}
        size={theme.fontSizes.lg}
        stroke={1.5}
      />
      <Title order={6} weight={600}>
        {label}
      </Title>
    </Link>
  ));

  return (
    <MantineNavbar
      width={{ md: 300 }}
      hiddenBreakpoint='md'
      hidden={!opened}
      p='xl'
      sx={{ boxShadow: theme.shadows.xl }}
      withBorder={false}
    >
      <MantineNavbar.Section grow>
        <MediaQuery smallerThan='md' styles={{ display: 'none' }}>
          <Stack spacing='xs'>
            <Image
              src='/images/logo/logo_nav.png'
              alt='fresh-market-logo'
              height={28}
              my='xl'
              fit='contain'
            />
            <Badge
              size='lg'
              variant='gradient'
              gradient={{ from: 'teal', to: 'lime', deg: 105 }}
            >
              {profile.role === 'super_admin' && 'Главный админ'}
              {profile.role === 'company_admin' && 'Админ'}
              {profile.role === 'worker' && 'Сотрудник'}
            </Badge>
          </Stack>
        </MediaQuery>

        <Stack pt='xl' spacing='xs'>
          {links}
        </Stack>
      </MantineNavbar.Section>

      <MantineNavbar.Section className={classes.footer}>
        <Button
          variant='subtle'
          color='red'
          fullWidth
          onClick={logout}
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
          size='md'
        >
          <Group spacing='xs'>
            <IconLogout
              color={theme.colors.red[5]}
              size={theme.fontSizes.lg}
              stroke={1.5}
            />
            <Title order={6} weight={600}>
              Выйти
            </Title>
          </Group>
        </Button>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};

export default Navbar;
