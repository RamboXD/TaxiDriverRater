import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  Pagination,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconFileAlert,
  IconPlus,
  IconSearch,
  IconEye,
  IconPencil,
  IconBuildingSkyscraper,
} from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';
import {
  GetCompanyCompanyProfile,
  GetCompanyUserProfile,
  UserProfile,
} from 'types/profileTypes';
import DrawerWorkerCreateForm from './components/DrawerWorkerCreateForm';
import Table from 'components/Table';
import { useAuth } from 'contexts/AuthContext';
import useCompany from 'hooks/company/useCompany';

const Company = () => {
  const { profile }: { profile: UserProfile; logout: () => void } = useAuth();
  const theme = useMantineTheme();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isSuccess, isError } = useCompany(
    profile.company?.ID,
  );

  const company = data?.data.company as GetCompanyCompanyProfile;
  const workers = (data?.data.users || []) as GetCompanyUserProfile[];

  const [
    isCreationFormOpened,
    { open: openCreationForm, close: closeCreationForm },
  ] = useDisclosure(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
    setPage(1);
  };

  const filteredWorkers = workers
    .filter((worker) =>
      worker.Name.toLowerCase().includes(search.toLowerCase()),
    )
    .slice((page - 1) * pageSize, page * pageSize);

  // Mapping function for roles
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'company_admin':
        return 'Админ';
      case 'worker':
        return 'Сотрудник';
      case 'super_admin':
        return 'Главный Админ';
      default:
        return role;
    }
  };

  return (
    <Stack>
      <Flex direction='column'>
        <Title weight={700}>Сотрудники</Title>
        <Text color='dimmed'>Список сотрудников компании</Text>
      </Flex>
      {isLoading && (
        <Center mt='xl'>
          <Loader />
        </Center>
      )}

      {isError && (
        <EmptyState
          mt='xl'
          title='Ошибка'
          description='Произошла ошибка при получении данных компании.'
          Icon={
            <Avatar radius='100%' size='xl' variant='light' color='red'>
              <IconFileAlert size={25} />
            </Avatar>
          }
        />
      )}

      {isSuccess && (
        <>
          {/* Workers Table */}

          <Grid columns={10} my='md'>
            <Grid.Col sm={10} md={4}>
              <TextInput
                icon={<IconSearch size={theme.fontSizes.lg} />}
                placeholder='Поиск по имени сотрудника'
                value={search}
                onChange={handleSearchChange}
              />
            </Grid.Col>
            <Grid.Col sm={10} md={2} />
            <Grid.Col sm={10} md={4}>
              <Group position='right'>
                <Button
                  leftIcon={<IconPlus size={theme.fontSizes.lg} />}
                  onClick={openCreationForm}
                >
                  Добавить сотрудника
                </Button>
              </Group>
            </Grid.Col>
          </Grid>

          {workers.length === 0 ? (
            <EmptyState
              title='Нет сотрудников'
              description='Нет доступных сотрудников для отображения.'
            />
          ) : (
            <Paper my='lg'>
              <Table
                data={filteredWorkers}
                columns={[
                  { Header: 'Имя', accessor: 'Name' },
                  { Header: 'Фамилия', accessor: 'Surname' },
                  { Header: 'Отчество', accessor: 'Patronymic' },
                  { Header: 'ИИН', accessor: 'IIN' },
                  { Header: 'Email', accessor: 'Email' },
                  {
                    Header: 'Роль',
                    accessor: 'Role',
                    Cell: ({
                      row,
                    }: {
                      row: { original: GetCompanyUserProfile };
                    }) => getRoleLabel(row.original.Role),
                  },
                  // {
                  //   Header: 'Действия',
                  //   Cell: ({
                  //     row,
                  //   }: {
                  //     row: { original: GetCompanyUserProfile };
                  //   }) => (
                  //     <Group>
                  //       <Tooltip label='Посмотреть детали'>
                  //         <ActionIcon variant='light' color='yellow' size='lg'>
                  //           <IconEye size={theme.fontSizes.lg} />
                  //         </ActionIcon>
                  //       </Tooltip>
                  //       {/* <Tooltip label='Редактировать'>
                  //         <ActionIcon variant='light' color='green' size='lg'>
                  //           <IconPencil size={theme.fontSizes.md} />
                  //         </ActionIcon>
                  //       </Tooltip> */}
                  //     </Group>
                  //   ),
                  // },
                ]}
                isLoading={isLoading}
                EmptyState={
                  <EmptyState
                    mt='xl'
                    title='Нет сотрудников'
                    description='Нет доступных сотрудников для отображения.'
                  />
                }
              />

              <Pagination
                mt='lg'
                value={page}
                onChange={setPage}
                total={Math.ceil(workers.length / pageSize)}
                siblings={1}
                boundaries={1}
              />
            </Paper>
          )}

          <DrawerWorkerCreateForm
            opened={isCreationFormOpened}
            onClose={closeCreationForm}
            title='Добавить сотрудника'
            companyId={profile.company?.ID}
          />
        </>
      )}
    </Stack>
  );
};

export default Company;
