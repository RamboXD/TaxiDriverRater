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
      <Title order={1}>Профиль</Title>
      <Text color='dimmed' size='sm'>
        Просмотр и редактирование данных пользователя и компании
      </Text>
      <Divider my='md' />

      {/* User Information Card */}
      <Card withBorder shadow='md' radius='md' p='lg'>
        <Group position='apart' align='flex-start' mb='md'>
          <Group align='center'>
            <Avatar color='blue' radius='xl' size='lg'>
              <IconUser size={24} />
            </Avatar>
            <Stack spacing={2}>
              <Title order={3}>Информация о пользователе</Title>
              <Text color='dimmed' size='sm'>
                Персональные данные пользователя
              </Text>
            </Stack>
          </Group>
          <Button
            onClick={openUserEditForm}
            leftIcon={<IconEdit size={16} />}
            variant='light'
            color='blue'
            size='md'
          >
            Редактировать
          </Button>
        </Group>

        <Divider mb='md' />

        <Stack spacing='sm'>
          <Group spacing='xs'>
            <Text weight={500}>Имя:</Text>
            <Text>{profile.user.name}</Text>
          </Group>
          <Group spacing='xs'>
            <Text weight={500}>Фамилия:</Text>
            <Text>{profile.user.surname}</Text>
          </Group>
          <Group spacing='xs'>
            <Text weight={500}>Отчество:</Text>
            <Text>{profile.user.patronymic || 'Не указано'}</Text>
          </Group>
          <Group spacing='xs'>
            <Text weight={500}>ИИН:</Text>
            <Text>{profile.user.iin}</Text>
          </Group>
        </Stack>
      </Card>

      {/* Company Information Card */}
      <Card withBorder shadow='md' radius='md' p='lg'>
        <Group position='apart' align='flex-start' mb='md'>
          <Group align='center'>
            <Avatar color='green' radius='xl' size='lg'>
              <IconBuildingSkyscraper size={24} />
            </Avatar>
            <Stack spacing={2}>
              <Title order={3}>Информация о компании</Title>
              <Text color='dimmed' size='sm'>
                Данные вашей компании
              </Text>
            </Stack>
          </Group>
          <Button
            onClick={openCompanyEditForm}
            leftIcon={<IconEdit size={16} />}
            variant='light'
            color='green'
            size='md'
          >
            Редактировать
          </Button>
        </Group>

        <Divider mb='md' />

        <Stack spacing='sm'>
          <Group spacing='xs'>
            <Text weight={500}>Название компании:</Text>
            <Text>{profile.company.companyName}</Text>
          </Group>
          <Group spacing='xs'>
            <Text weight={500}>Адрес:</Text>
            <Text>{profile.company.Address}</Text>
          </Group>
          <Group spacing='xs'>
            <Text weight={500}>Имя руководителя:</Text>
            <Text>{profile.company.HeadName}</Text>
          </Group>
          <Group spacing='xs'>
            <Text weight={500}>Фамилия руководителя:</Text>
            <Text>{profile.company.HeadSurname}</Text>
          </Group>
          <Group spacing='xs'>
            <Text weight={500}>Отчество руководителя:</Text>
            <Text>{profile.company.HeadPatronymic || 'Не указано'}</Text>
          </Group>
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
