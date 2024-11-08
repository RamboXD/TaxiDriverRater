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
  IconBuildingCottage,
  IconFileAlert,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';
import Table from 'components/Table';
import useFarms from 'hooks/farm/useFarms';
import { GrossMarket } from 'types/generated';

import DrawerFarmWriteFrom from './components/DrawerFarmWriteFrom.tsx';
import ModalDeleteFarm from './components/ModalDeleteFarm.tsx';

const Farms = (): JSX.Element => {
  const theme = useMantineTheme();

  const [selectedFarm, setSelectedFarm] = useState<GrossMarket | undefined>(undefined);
  const [farmsData, setFarmsData] = useState<GrossMarket[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 250);

  const { data, isSuccess, isLoading, isFetching, isError, error } = useFarms({
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

  const handleEdit = (farm: GrossMarket) => {
    setSelectedFarm(farm);
    openUpdateForm();
  };
  const handleCloseUpdateForm = () => {
    setSelectedFarm(undefined);
    closeUpdateForm();
  };

  const handleDelete = (farm: GrossMarket) => {
    setSelectedFarm(farm);
    openDeleteModal();
  };
  const handleCloseDeleteModal = () => {
    setSelectedFarm(undefined);
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
      Header: 'Country',
      accessor: 'country',
    },
    {
      Header: 'City',
      accessor: 'city',
    },
    {
      Header: 'Street',
      accessor: 'street',
    },
    {
      Header: 'Action',
      name: 'action',
      Cell: ({ row }: { row: { original: GrossMarket } }) => (
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
      setFarmsData(data?.data.results || []);
    }
  }, [isSuccess, data?.data]);

  return (
    <Stack>
      <Flex direction='column'>
        <Title weight={700}>Farms</Title>
        <Text color='dimmed'>Farms locations information</Text>
      </Flex>

      <Divider my='md' />

      <Grid columns={10}>
        <Grid.Col sm={10} md={4}>
          <TextInput
            icon={<IconSearch size={theme.fontSizes.lg} />}
            placeholder='Search farm by name'
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
              Add Farm
            </Button>
          </Group>
        </Grid.Col>
      </Grid>

      <Paper sx={{ position: 'relative' }}>
        <Table
          data={farmsData}
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
              {isSuccess && farmsData.length === 0 && (
                <EmptyState
                  mt='xl'
                  title='No farms'
                  description='There are no farms to display.'
                  Icon={
                    <Avatar
                      radius='100%'
                      size='xl'
                      variant='light'
                      color='primary'
                    >
                      <IconBuildingCottage size={25} />
                    </Avatar>
                  }
                />
              )}
            </>
          }
        />
      </Paper>

      <DrawerFarmWriteFrom
        farm={selectedFarm}
        opened={isUpdateFormOpened && !!selectedFarm}
        onClose={handleCloseUpdateForm}
        title={`Edit ${selectedFarm?.name}`}
      />

      <DrawerFarmWriteFrom
        opened={isCreationFormOpened && !selectedFarm}
        onClose={closeCreationForm}
        title='Farm Creation'
      />

      <ModalDeleteFarm
        farm={selectedFarm}
        opened={isDeleteModalOpened && !!selectedFarm}
        onClose={handleCloseDeleteModal}
      />
    </Stack>
  );
};

export default Farms;
