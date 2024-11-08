import { useEffect, useState } from 'react';
import {
  ActionIcon,
  Avatar,
  Button,
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
} from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';
import { DriverProfile } from 'types/profileTypes';
import useDrivers from 'hooks/drivers/useDrivers';
import DrawerDriverCreateForm from './components/DrawerDriverCreateForm';
import Table from 'components/Table';
import { useNavigate } from 'react-router-dom';

const DriverList = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isSuccess, isError } = useDrivers();
  const drivers = data?.data?.drivers || [];

  const [
    isCreationFormOpened,
    { open: openCreationForm, close: closeCreationForm },
  ] = useDisclosure(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
    setPage(1);
  };

  const filteredDrivers = drivers
    .filter((driver: DriverProfile) => {
      const query = search.toLowerCase();
      return (
        driver.Name.toLowerCase().includes(query) ||
        driver.Surname.toLowerCase().includes(query) ||
        driver.IIN.includes(query)
      );
    })
    .slice((page - 1) * pageSize, page * pageSize);

  return (
    <Stack>
      <Flex direction='column'>
        <Title weight={700}>Водители</Title>
        <Text color='dimmed'>Список водителей</Text>
      </Flex>

      <Divider my='md' />

      <Grid columns={10}>
        <Grid.Col sm={10} md={4}>
          <TextInput
            icon={<IconSearch size={theme.fontSizes.lg} />}
            placeholder='Поиск по имени, фамилии или ИИН'
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
              Добавить водителя
            </Button>
          </Group>
        </Grid.Col>
      </Grid>

      {isLoading && (
        <Center mt='xl'>
          <Loader />
        </Center>
      )}

      {isError && (
        <EmptyState
          mt='xl'
          title='Ошибка'
          description='Произошла ошибка при получении данных.'
          Icon={
            <Avatar radius='100%' size='xl' variant='light' color='red'>
              <IconFileAlert size={25} />
            </Avatar>
          }
        />
      )}

      {isSuccess && (
        <Paper my='lg'>
          <Table
            data={filteredDrivers}
            columns={[
              { Header: 'Имя', accessor: 'Name' },
              { Header: 'Фамилия', accessor: 'Surname' },
              { Header: 'Отчество', accessor: 'Patronymic' },
              { Header: 'ИИН', accessor: 'IIN' },
              { Header: 'Адрес', accessor: 'Address' },
              { Header: 'Телефон', accessor: 'PhoneNumber' },
              {
                Header: 'Действия',
                Cell: ({ row }: { row: { original: DriverProfile } }) => (
                  <Group>
                    <Tooltip label='Посмотреть детали'>
                      <ActionIcon
                        onClick={() => {
                          navigate(`/drivers/${row.original.ID}`);
                        }}
                        variant='light'
                        color='yellow'
                        size='lg'
                      >
                        <IconEye size={theme.fontSizes.lg} />
                      </ActionIcon>
                    </Tooltip>
                    {/* <Tooltip label='Редактировать'>
                      <ActionIcon variant='light' color='green' size='lg'>
                        <IconPencil size={theme.fontSizes.md} />
                      </ActionIcon>
                    </Tooltip> */}
                  </Group>
                ),
              },
            ]}
            isLoading={isLoading}
            EmptyState={
              <EmptyState
                mt='xl'
                title='Нет водителей'
                description='Нет доступных водителей для отображения.'
              />
            }
          />

          <Pagination
            mt='lg'
            value={page}
            onChange={setPage}
            total={Math.ceil(drivers.length / pageSize)}
            siblings={1}
            boundaries={1}
          />
        </Paper>
      )}

      <DrawerDriverCreateForm
        opened={isCreationFormOpened}
        onClose={closeCreationForm}
        title='Добавить водителя'
      />
    </Stack>
  );
};

export default DriverList;
