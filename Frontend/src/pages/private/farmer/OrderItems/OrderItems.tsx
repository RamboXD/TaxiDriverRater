import { useEffect, useState } from 'react';

import {
  Avatar,
  Divider,
  Flex,
  Grid,
  Image,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBuildingCottage,
  IconFileAlert,
  IconSearch,
} from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';
import Table from 'components/Table';
import useOrderItemsFarmer from 'hooks/order_item/useOrderItemsFarmer';
import { OrderItem } from 'types/generated';

const OrderItems = (): JSX.Element => {
  const theme = useMantineTheme();

  const [orderItemsData, setOrderItemsData] = useState<OrderItem[]>([]);
  const [search, setSearch] = useState('');

  const { data, isSuccess, isLoading, isFetching, isError, error } =
    useOrderItemsFarmer(undefined);

  const columns = [
    {
      Header: 'Image',
      accessor: 'advert.product.imageUrl',
      Cell: ({ value }: { value: string }) => (
        <>
          <Image src={value} width={72} height={72} alt='order_image' />
        </>
      ),
    },
    {
      Header: 'Farm',
      accessor: 'advert.farm.name',
    },
    {
      Header: 'Branch name',
      accessor: 'order.branch.name',
    },
    {
      Header: 'Product',
      accessor: 'advert.quality.sort.product.name',
    },
    {
      Header: 'Sort',
      accessor: 'advert.quality.sort.name',
    },
    {
      Header: 'Quality',
      accessor: 'advert.quality.name',
    },
    {
      Header: 'Volume',
      accessor: 'volume',
      Cell: ({ value }: { value: OrderItem['volume'] }) => `${value} kg`,
    },
  ];

  useEffect(() => {
    if (isSuccess && data?.data) {
      setOrderItemsData(data?.data.results);
    }
  }, [isSuccess, data?.data.results]);

  return (
    <Stack>
      <Flex direction='column'>
        <Title weight={700}>Order Items</Title>
        <Text color='dimmed'>Order Items information</Text>
      </Flex>

      <Divider my='md' />

      <Grid columns={10}>
        <Grid.Col sm={10} md={4}>
          <TextInput
            icon={<IconSearch size={theme.fontSizes.lg} />}
            placeholder='Search order by name'
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col sm={10} md={2} />
      </Grid>

      <Paper sx={{ position: 'relative' }}>
        <Table
          data={orderItemsData}
          columns={columns}
          isLoading={isLoading || isFetching}
          EmptyState={
            <>
              {isError && (
                <EmptyState
                  mt='xl'
                  title='Error'
                  description={
                    error?.response?.data.error ||
                    'Something went wrong while fetching data.'
                  }
                  Icon={
                    <Avatar radius='100%' size='xl' variant='light' color='red'>
                      <IconFileAlert size={25} />
                    </Avatar>
                  }
                />
              )}
              {isSuccess && orderItemsData.length === 0 && (
                <EmptyState
                  mt='xl'
                  title='No OrderItems'
                  description='There are no OrderItems to display.'
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
    </Stack>
  );
};

export default OrderItems;
