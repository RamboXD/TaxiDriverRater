import {
  ActionIcon,
  Anchor,
  Button,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  createStyles,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconChevronLeft } from '@tabler/icons-react';
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
  role: UserLogin['role'];
}

const LoginBusiness = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();

  const {
    handleLogin,
    isLoginLoading,
  }: {
    handleLogin: (payload: UserLogin) => void;
    isLoginLoading: boolean;
  } = useAuth();

  const form = useForm<FormValues>({
    initialValues: {
      email: '',
      password: '',
      role: 'owner',
    },

    validate: {
      email: (value) => emailValidator(value),
    },
  });

  const handleSubmit = (formValues: FormValues) => {
    handleLogin(formValues);
  };

  return (
    <Paper shadow='2xl' radius='md' p='xl' maw={520} w='100%' m='0 auto'>
      <Stack>
        <div className={classes.container}>
          <ActionIcon component={Link} to='/login'>
            <IconChevronLeft size={theme.fontSizes.lg} />
          </ActionIcon>
          <Title order={4}>Login as Business</Title>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label={
                <Text size='sm' align='center' weight={600}>
                  Email
                </Text>
              }
              placeholder='Enter your email'
              readOnly={isLoginLoading}
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label={
                <Text size='sm' align='center' weight={600}>
                  Password
                </Text>
              }
              placeholder='Enter your password'
              readOnly={isLoginLoading}
              {...form.getInputProps('password')}
            />

            <Button mt='md' type='submit' fullWidth loading={isLoginLoading}>
              Log in
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
          Forgot password
        </Anchor>

        <Flex justify='center' gap='xs' mt='md'>
          <Text weight={500} ta='center' c='black'>
            Don’t have an account?{' '}
            <Anchor component={Link} to='/register/business' c='green.6'>
              Sign up
            </Anchor>
          </Text>
        </Flex>
      </Stack>
    </Paper>
  );
};

export default LoginBusiness;
