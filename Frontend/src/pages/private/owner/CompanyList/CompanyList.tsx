import { useEffect, useState } from 'react';
import {
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
import { CompanyProfile } from 'types/profileTypes';
import useCompanies from 'hooks/company/useCompanies';
import DrawerCompanyCreateForm from './components/DrawerCompanyCreateForm';
import Table from 'components/Table';

const CompanyList = () => {
  const theme = useMantineTheme();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isSuccess, isError } = useCompanies();
  const companies = data?.data?.companies || [];

  const [
    isCreationFormOpened,
    { open: openCreationForm, close: closeCreationForm },
  ] = useDisclosure(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
    setPage(1);
  };

  const filteredCompanies = companies
    .filter((company: CompanyProfile) =>
      company.Name.toLowerCase().includes(search.toLowerCase()),
    )
    .slice((page - 1) * pageSize, page * pageSize);

  return (
    <Stack>
      <Flex direction='column'>
        <Title weight={700}>Компании</Title>
        <Text color='dimmed'>Список компаний</Text>
      </Flex>

      <Divider my='md' />

      <Grid columns={10}>
        <Grid.Col sm={10} md={4}>
          <TextInput
            icon={<IconSearch size={theme.fontSizes.lg} />}
            placeholder='Поиск по названию компании'
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
              Добавить компанию
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
          description={'Произошла ошибка при получении данных.'}
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
            data={filteredCompanies}
            columns={[
              { Header: 'Название', accessor: 'Name' },
              { Header: 'Адрес', accessor: 'Address' },
              { Header: 'ИНН', accessor: 'IIN' },
              { Header: 'BIN', accessor: 'BIN' },
              {
                Header: 'Действия',
                Cell: ({}: { row: { original: CompanyProfile } }) => (
                  <Group>
                    <Tooltip label='Посмотреть детали'>
                      <Button variant='subtle' color='yellow' size='sm'>
                        <IconEye size={theme.fontSizes.md} />
                      </Button>
                    </Tooltip>
                    <Tooltip label='Редактировать'>
                      <Button variant='subtle' color='green' size='sm'>
                        <IconPencil size={theme.fontSizes.md} />
                      </Button>
                    </Tooltip>
                  </Group>
                ),
              },
            ]}
            isLoading={isLoading}
            EmptyState={
              <EmptyState
                mt='xl'
                title='Нет компаний'
                description='Нет доступных компаний для отображения.'
              />
            }
          />

          <Pagination
            mt='lg'
            value={page}
            onChange={setPage}
            total={Math.ceil(companies.length / pageSize)}
            siblings={1}
            boundaries={1}
          />
        </Paper>
      )}

      <DrawerCompanyCreateForm
        opened={isCreationFormOpened}
        onClose={closeCreationForm}
        title='Создать компанию'
      />
    </Stack>
  );
};

export default CompanyList;
