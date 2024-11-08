import { Text, Button, Image, Stack } from '@mantine/core';
import { useAuth } from 'contexts/AuthContext';

const CompleteStep = () => {
  const { logout } = useAuth();

  return (
    <Stack>
      <Text color='dimmed'>
        Your verification is being processed. We will send you updates via your
        phone.
      </Text>
      <Image
        src={`/images/email.png`}
        alt='email'
        width={180}
        height={180}
        m='0 auto'
      />

      <Button mt='xl' variant='light' color='red' fullWidth onClick={logout}>
        Log out
      </Button>
    </Stack>
  );
};

export default CompleteStep;
