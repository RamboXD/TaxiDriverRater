import { useEffect, useState } from 'react';

import { Divider, Flex, Stack, Tabs, Text, Title } from '@mantine/core';
import useFarmerOrders from 'hooks/farmer/useFarmerOrders';
import { Order } from 'types/generated';

import OrdersTable from './components/OrdersTable.tsx';

const Orders = (): JSX.Element => {
  const [orderData, setOrderData] = useState<Order[]>([]);
  const { data, isSuccess, isLoading, isFetching, isError, error, refetch } =
    useFarmerOrders();

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (isSuccess && data?.data) {
      setOrderData(data?.data.results || []);
    }
  }, [isSuccess, data?.data]);

  return (
    <Stack>
      <Flex direction='column'>
        <Title weight={700}>Orders</Title>
        <Text color='dimmed'>Grossmarket incomming and accepted orders</Text>
      </Flex>
      <Divider />
      <Tabs variant='pills' defaultValue='incomming'>
        <Tabs.List>
          <Tabs.Tab value='incomming'>Incomming Orders</Tabs.Tab>
          <Tabs.Tab value='accepted'>Accepted Orders</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='incomming'>
          <OrdersTable
            isError={isError}
            isFetching={isFetching}
            isLoading={isLoading}
            isSuccess={isSuccess}
            error={error}
            orders={orderData.filter((order) => order.status === 'created')}
          />
        </Tabs.Panel>
        <Tabs.Panel value='accepted'>
          <OrdersTable
            isError={isError}
            isFetching={isFetching}
            isLoading={isLoading}
            isSuccess={isSuccess}
            error={error}
            orders={orderData.filter(
              (order) =>
                order.status !== 'created' && 
                order.status !== 'declined' && 
                order.status !== 'finished',
            )}
          />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default Orders;
