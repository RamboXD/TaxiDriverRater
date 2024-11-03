import {
  ActionIcon,
  Anchor,
  Button,
  Input,
  Paper,
  PasswordInput,
  Stack,
  Text,
  Title,
  createStyles,
} from '@mantine/core';
import { useForm } from '@mantine/form';
// import { IconChevronLeft } from '@tabler/icons-react';
import { useAuth } from 'contexts/AuthContext';
import { Link } from 'react-router-dom';
import { UserLogin } from 'types/generated';
import { emailValidator } from 'utils/validations';

const useStyles = createStyles((theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr max-content 1fr',
    gap: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

interface FormValues {
  email: string;
  password: string;
}

const LoginFarmer = () => {
  const { classes } = useStyles();

  // const navigate = useNavigate();

  const form = useForm<FormValues>({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => emailValidator(value),
    },
  });

  // const handleBack = () => {
  //   navigate('/login');
  // };

  const {
    handleLogin,
    isLoginLoading,
  }: {
    handleLogin: (payload: UserLogin) => void;
    isLoginLoading: boolean;
  } = useAuth();

  return (
    <Paper shadow='2xl' radius='md' p='xl' maw={520} w='100%' m='0 auto'>
      <Stack spacing='xl'>
        <div className={classes.container}>
          <ActionIcon onClick={() => {}}>
            {/* <IconChevronLeft size={theme.fontSizes.lg} /> */}
          </ActionIcon>
          <Title order={4}>Логин</Title>
        </div>

        <form onSubmit={form.onSubmit(handleLogin)}>
          <Stack>
            <Input.Wrapper error={form.errors.email}>
              <Input.Label>
                <Text size='sm' align='center' weight={600}>
                  Почта
                </Text>
              </Input.Label>
              <Input
                placeholder='Введите вашу почту'
                readOnly={isLoginLoading}
                {...form.getInputProps('email')}
              />
            </Input.Wrapper>
            <Input.Wrapper error={form.errors.password}>
              <PasswordInput
                label={
                  <Text size='sm' align='center' weight={600}>
                    Пароль
                  </Text>
                }
                placeholder='Введите ваш пароль'
                readOnly={isLoginLoading}
                {...form.getInputProps('password')}
              />
            </Input.Wrapper>
            <Button type='submit' fullWidth loading={isLoginLoading}>
              Войти
            </Button>
          </Stack>
        </form>

        <Anchor
          component={Link}
          to='/login/forgot_password'
          fw={500}
          ta='center'
          color='dimmed'
          size='sm'
          underline
        >
          Забыли пароль?
        </Anchor>

        {/* <Flex justify='center' gap='xs' mt='md'>
          <Text weight={500} ta='center' c='black'>
            Don’t have an account?{' '}
            <Anchor component={Link} to='/register/farmer' c='green.6'>
              Sign up
            </Anchor>
          </Text>
        </Flex> */}
      </Stack>
    </Paper>
  );
};

export default LoginFarmer;
