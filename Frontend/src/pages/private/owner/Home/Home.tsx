import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconEdit,
  IconUser,
  IconBuildingSkyscraper,
} from '@tabler/icons-react';
import { useAuth } from 'contexts/AuthContext';
import DrawerUserEditForm from './components/DrawerUserEditForm';
import DrawerCompanyEditForm from './components/DrawerCompanyEditForm';
import useUpdateUserProfile from 'hooks/user/useUpdateUserProfile';
import useUpdateCompanyProfile from 'hooks/company/useUpdateCompanyProfile';

const Home = () => {
  const { profile } = useAuth();

  const [
    isUserEditFormOpened,
    { close: closeUserEditForm, open: openUserEditForm },
  ] = useDisclosure(false);

  const [
    isCompanyEditFormOpened,
    { close: closeCompanyEditForm, open: openCompanyEditForm },
  ] = useDisclosure(false);

  const updateUserProfileMutation = useUpdateUserProfile(profile.user.id);
  const updateCompanyProfileMutation = useUpdateCompanyProfile(
    profile.company.ID,
  );

  const handleUserUpdate = (updatedValues: {
    name: string;
    surname: string;
    patronymic?: string;
    iin: string;
  }) => {
    updateUserProfileMutation.mutate(updatedValues, {
      onSuccess: () => {
        closeUserEditForm();
      },
    });
  };

  const handleCompanyUpdate = (updatedValues: {
    companyName: string;
    address: string;
    headName: string;
    headSurname: string;
    headPatronymic?: string;
  }) => {
    updateCompanyProfileMutation.mutate(updatedValues, {
      onSuccess: () => {
        closeCompanyEditForm();
      },
    });
  };

  return (
    <Stack spacing='xl'>
      <Title weight={700}>Профиль</Title>
      <Text color='dimmed'>
        Просмотр и редактирование данных пользователя и компании
      </Text>
      <Divider my='md' />

      {/* User Information Card */}
      <Card withBorder shadow='md' radius='md' p='lg'>
        <Group position='apart' mb='sm'>
          <Group>
            <Avatar color='blue' radius='xl'>
              <IconUser size='1.25rem' />
            </Avatar>
            <Stack spacing={0}>
              <Title order={4}>Информация о пользователе</Title>
              <Text color='dimmed' size='xs'>
                Персональные данные пользователя
              </Text>
            </Stack>
          </Group>
          <Button
            onClick={openUserEditForm}
            leftIcon={<IconEdit size='1rem' />}
            variant='outline'
            size='xs'
          >
            Редактировать
          </Button>
        </Group>

        <Divider mb='sm' />

        <Stack spacing='xs'>
          <Text>
            <strong>Имя:</strong> {profile.user.name}
          </Text>
          <Text>
            <strong>Фамилия:</strong> {profile.user.surname}
          </Text>
          <Text>
            <strong>Отчество:</strong> {profile.user.patronymic || 'Не указано'}
          </Text>
          <Text>
            <strong>ИИН:</strong> {profile.user.iin}
          </Text>
        </Stack>
      </Card>

      {/* Company Information Card */}
      <Card withBorder shadow='md' radius='md' p='lg'>
        <Group position='apart' mb='sm'>
          <Group>
            <Avatar color='green' radius='xl'>
              <IconBuildingSkyscraper size='1.25rem' />
            </Avatar>
            <Stack spacing={0}>
              <Title order={4}>Информация о компании</Title>
              <Text color='dimmed' size='xs'>
                Данные вашей компании
              </Text>
            </Stack>
          </Group>
          <Button
            onClick={openCompanyEditForm}
            leftIcon={<IconEdit size='1rem' />}
            variant='outline'
            size='xs'
          >
            Редактировать
          </Button>
        </Group>

        <Divider mb='sm' />

        <Stack spacing='xs'>
          <Text>
            <strong>Название компании:</strong> {profile.company.companyName}
          </Text>
          <Text>
            <strong>Адрес:</strong> {profile.company.Address}
          </Text>
          <Text>
            <strong>Имя главы:</strong> {profile.company.HeadName}
          </Text>
          <Text>
            <strong>Фамилия главы:</strong> {profile.company.HeadSurname}
          </Text>
          <Text>
            <strong>Отчество главы:</strong>{' '}
            {profile.company.HeadPatronymic || 'Не указано'}
          </Text>
        </Stack>
      </Card>

      {/* Edit Drawers */}
      <DrawerUserEditForm
        profile={profile}
        opened={isUserEditFormOpened}
        onClose={closeUserEditForm}
        onSubmit={handleUserUpdate}
      />

      <DrawerCompanyEditForm
        company={profile.company}
        opened={isCompanyEditFormOpened}
        onClose={closeCompanyEditForm}
        onSubmit={handleCompanyUpdate}
      />
    </Stack>
  );
};

export default Home;
