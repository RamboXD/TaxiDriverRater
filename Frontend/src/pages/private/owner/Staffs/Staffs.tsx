import { useEffect, useState } from 'react';

import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import {
  IconFileAlert,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';
import Table from 'components/Table';
import dayjs from 'dayjs';
import useStaffs from 'hooks/staff/useStaffs';
import { Staff } from 'types/generated';

import DrawerStaffWriteForm from './components/DrawerStaffWriteForm.tsx';
import ModalDeleteStaff from './components/ModalDeleteStaff.tsx';

const Staffs = (): JSX.Element => {
  const theme = useMantineTheme();

  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>(
    undefined,
  );
  const [staffsData, setStaffsData] = useState<Staff[]>([]);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebouncedValue(search, 250);

  const { data, isSuccess, isLoading, isFetching, isError, error } = useStaffs({
    search: debouncedSearch,
  });

  const [
    isCreationFormOpened,
    { close: closeCreationForm, open: openCreationForm },
  ] = useDisclosure(false);
  const [isUpdateFormOpened, { close: closeUpdateForm, open: openUpdateForm }] =
    useDisclosure(false);
  const [
    isDeleteModalOpened,
    { close: closeDeleteModal, open: openDeleteModal },
  ] = useDisclosure(false);

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    openUpdateForm();
  };
  const handleCloseUpdateForm = () => {
    setSelectedStaff(undefined);
    closeUpdateForm();
  };

  const handleDelete = (staff: Staff) => {
    setSelectedStaff(staff);
    openDeleteModal();
  };
  const handleCloseDeleteModal = () => {
    setSelectedStaff(undefined);
    closeDeleteModal();
  };
  useEffect(() => {
    if (isSuccess && data?.data) {
      setStaffsData(data?.data.results);
    }
  }, [isSuccess, data?.data]);

  const columns = [
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'First Name',
      accessor: 'firstName',
    },
    {
      Header: 'Last Name',
      accessor: 'lastName',
    },
    {
      Header: 'Activated',
      accessor: 'activated',
      Cell: ({ value }: { value: Staff['activated'] }) => (
        <Badge color={value ? 'green' : 'orange'}>
          {value ? 'True' : 'False'}
        </Badge>
      ),
    },
    {
      Header: 'Created At',
      accessor: 'createdAt',
      Cell: ({ value }: { value: Staff['createdAt'] }) =>
        dayjs(value).format('DD/MM/YYYY HH:MM'),
    },
    {
      Header: 'Action',
      name: 'action',
      Cell: ({ row }: { row: { original: Staff } }) => (
        <Group>
          <Tooltip label='Edit'>
            <ActionIcon
              variant='light'
              color='yellow'
              size='lg'
              onClick={() => handleEdit(row.original)}
            >
              <IconPencil size={theme.fontSizes.lg} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Delete'>
            <ActionIcon
              variant='light'
              color='red'
              size='lg'
              onClick={() => handleDelete(row.original)}
            >
              <IconTrash size={theme.fontSizes.lg} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];

  return (
    <Stack>
      <Flex direction='column'>
        <Title weight={700}>Staffs</Title>
        <Text color='dimmed'>{"Company's Staffs"}</Text>
      </Flex>

      <Divider my='md' />

      <Grid columns={10}>
        <Grid.Col sm={10} md={4}>
          <TextInput
            icon={<IconSearch size={theme.fontSizes.lg} />}
            placeholder='Search staff by name or email'
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col sm={10} md={2} />
        <Grid.Col sm={10} md={4}>
          <Group position='right'>
            <Button
              onClick={openCreationForm}
              leftIcon={<IconPlus size={theme.fontSizes.lg} />}
            >
              Add Staff
            </Button>
          </Group>
        </Grid.Col>
      </Grid>

      <Paper sx={{ position: 'relative' }}>
        <Table
          data={staffsData}
          columns={columns}
          isLoading={isLoading || isFetching}
          EmptyState={
            <>
              {isError && (
                <EmptyState
                  mt='xl'
                  title='Error'
                  description={
                    error?.response?.data.message ||
                    'Something went wrong while fetching data.'
                  }
                  Icon={
                    <Avatar radius='100%' size='xl' variant='light' color='red'>
                      <IconFileAlert size={25} />
                    </Avatar>
                  }
                />
              )}
              {isSuccess && staffsData.length === 0 && (
                <EmptyState
                  mt='xl'
                  title='No staffs'
                  description='There are no staffs to display.'
                  Icon={
                    <Avatar
                      radius='100%'
                      size='xl'
                      variant='light'
                      color='primary'
                    >
                      <IconUsers size={25} />
                    </Avatar>
                  }
                />
              )}
            </>
          }
        />
      </Paper>

      <DrawerStaffWriteForm
        staff={selectedStaff}
        opened={isUpdateFormOpened && !!selectedStaff}
        onClose={handleCloseUpdateForm}
        title={`Edit ${selectedStaff?.firstName}`}
      />

      <DrawerStaffWriteForm
        opened={isCreationFormOpened}
        onClose={closeCreationForm}
        title='Add Staff'
      />

      <ModalDeleteStaff
        staff={selectedStaff}
        opened={isDeleteModalOpened && !!selectedStaff}
        onClose={handleCloseDeleteModal}
      />
    </Stack>
  );
};

export default Staffs;
