import { Avatar, Button, Group, Image, Modal, ModalProps, Text } from '@mantine/core';
import { IconBuildingCottage, IconFileAlert } from '@tabler/icons-react';
import Table from 'components/Table';
import EmptyState from 'components/states/EmptyState';
import useOrderItemsFarmer from 'hooks/order_item/useOrderItemsFarmer';
import { useEffect, useState } from 'react';
import { OrderItem } from 'types/generated';

interface ModalDeleteFarmProps extends Pick<ModalProps, 'opened' | 'onClose'> {
  orderId: string;
}

const OrderItemsModal = ({ opened, onClose, orderId }: ModalDeleteFarmProps) => {
  const [orderData, setOrderData] = useState<OrderItem[]>([])
  const { data, isSuccess, isLoading, isFetching, isError, error } = useOrderItemsFarmer(orderId);

  const columns = [
    {
      Header: 'Image',
      accessor: 'sort.imageUrl',
      Cell: ({ value }: { value: string }) => (
        <Image src={value} width={35} height={35} radius='md' />
      ),
    },
    {
      Header: 'Name',
      accessor: 'sort.product.name',
    },
    {
      Header: 'Sort',
      accessor: 'sort.name',
    },
    {
      Header: 'Food class',
      accessor: 'quality.name',
    },
    {
      Header: 'Volume',
      accessor: 'volume',
    },
    {
      Header: 'Price',
      accessor: 'quality.priceSell'
    }
  ];

  useEffect(() => {
    if (isSuccess && data?.data) {
      setOrderData(data?.data.results || []);
    }
  }, [isSuccess, data?.data]);

  return (
    <Modal
      size="calc(70vw - 3rem)"
      opened={opened}
      onClose={onClose}
      title={<Text size='lg' fw={800}>Order items</Text>}
      centered
    >
      <Table
        data={orderData}
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
            {isSuccess && orderData.length === 0 && (
              <EmptyState
                mt='xl'
                title='No incomming orders'
                description='There are no incomming orders to display.'
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
      <Group mt='md' position='center'>
        <Button
          variant='default'
          fullWidth
          onClick={onClose}
        >
          Close
        </Button>
      </Group>
    </Modal>
  );
};

export default OrderItemsModal;
