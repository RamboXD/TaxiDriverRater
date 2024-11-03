import {
  Avatar,
  Card,
  Divider,
  Flex,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { UserProfile } from 'types/profileTypes';

interface UserProfileCardProps {
  profile: UserProfile;
}

const UserProfileCard = ({ profile }: UserProfileCardProps) => {
  const theme = useMantineTheme();
  const { user, company, role } = profile;

  return (
    <Card shadow='sm' radius='md' padding='lg'>
      <Flex direction='row' align='center' gap='md'>
        <Avatar
          radius='xl'
          color='blue'
          size='lg'
          src={null} // Add a placeholder or use profile picture URL if available
        >
          {user.name[0]}
        </Avatar>
        <Stack spacing={0}>
          <Title order={4}>
            {user.name} {user.surname}
          </Title>
          <Text color='dimmed' size='sm'>
            Роль:{' '}
            {role === 'super_admin'
              ? 'Супер Админ'
              : role === 'company_admin'
              ? 'Админ Компании'
              : 'Работник'}
          </Text>
        </Stack>
      </Flex>

      <Divider my='sm' />

      <Stack spacing='xs'>
        <Title order={5}>Данные пользователя</Title>
        <Text>Email: {user.email}</Text>
        <Text>ИИН: {user.iin}</Text>
        {company && (
          <>
            <Divider my='sm' />
            <Title order={5}>Данные компании</Title>
            <Text>Название компании: {company.Name}</Text>
            <Text>Адрес: {company.Address}</Text>
            <Text>БИН: {company.BIN}</Text>
            <Text>
              Глава: {company.HeadName} {company.HeadSurname}
            </Text>
          </>
        )}
      </Stack>
    </Card>
  );
};

export default UserProfileCard;
