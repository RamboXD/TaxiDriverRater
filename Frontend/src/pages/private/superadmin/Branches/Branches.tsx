import { useEffect, useState } from 'react';

import {
  ActionIcon,
  Avatar,
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
  IconBuilding,
  IconFileAlert,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';
import Table from 'components/Table';
import useBranches from 'hooks/branch/useBranches';
import { Branch } from 'types/generated/index';

import DrawerBranchWriteFrom from './components/DrawerBranchWriteFrom.tsx';
import ModalDeleteBranch from './components/ModalDeleteBranch.tsx';

const Branches = (): JSX.Element => {
  const theme = useMantineTheme();

  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>(
    undefined,
  );
  const [branchData, setBranchData] = useState<Branch[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 250);

  const { data, isSuccess, isLoading, isFetching, isError, error } =
    useBranches({
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

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    openUpdateForm();
  };
  const handleCloseUpdateForm = () => {
    setSelectedBranch(undefined);
    closeUpdateForm();
  };

  const handleDelete = (branch: Branch) => {
    setSelectedBranch(branch);
    openDeleteModal();
  };
  const handleCloseDeleteModal = () => {
    setSelectedBranch(undefined);
    closeDeleteModal();
  };

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      Cell: ({ value }: { value: string }) => (
        <Text weight={600} underline>
          {value}
        </Text>
      ),
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Country',
      accessor: 'address.country',
    },
    {
      Header: 'City',
      accessor: 'address.city',
    },
    {
      Header: 'Street',
      accessor: 'address.street',
    },
    {
      Header: 'Postal code',
      accessor: 'address.postalCode',
    },
    {
      Header: 'Action',
      name: 'action',
      Cell: ({ row }: { row: { original: Branch } }) => (
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

  useEffect(() => {
    if (isSuccess && data?.data) {
      setBranchData(data?.data.results);
    }
  }, [isSuccess, data?.data]);

  return (
    <Stack>
      <Flex direction='column'>
        <Title weight={700}>Branches</Title>
        <Text color='dimmed'>Branches locations information</Text>
      </Flex>

      <Divider my='md' />

      <Grid columns={10}>
        <Grid.Col sm={10} md={4}>
          <TextInput
            icon={<IconSearch size={theme.fontSizes.lg} />}
            placeholder='Search branch by name'
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col sm={10} md={2} />
        <Grid.Col sm={10} md={4}>
          <Group position='right'>
            <Button
              leftIcon={<IconPlus size={theme.fontSizes.lg} />}
              onClick={openCreationForm}
            >
              Add Branch
            </Button>
          </Group>
        </Grid.Col>
      </Grid>

      <Paper>
        <Table
          data={branchData}
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
              {isSuccess && branchData.length === 0 && (
                <EmptyState
                  mt='xl'
                  title='No branches'
                  description='There are no branches to display.'
                  Icon={
                    <Avatar
                      radius='100%'
                      size='xl'
                      variant='light'
                      color='primary'
                    >
                      <IconBuilding size={25} />
                    </Avatar>
                  }
                />
              )}
            </>
          }
        />
      </Paper>

      <DrawerBranchWriteFrom
        branch={selectedBranch}
        opened={isUpdateFormOpened && !!selectedBranch}
        onClose={handleCloseUpdateForm}
        title={`Edit ${selectedBranch?.name}`}
      />

      <DrawerBranchWriteFrom
        opened={isCreationFormOpened}
        onClose={closeCreationForm}
        title='Branch Creation'
      />

      <ModalDeleteBranch
        branch={selectedBranch}
        opened={isDeleteModalOpened && !!selectedBranch}
        onClose={handleCloseDeleteModal}
      />
    </Stack>
  );
};

export default Branches;
