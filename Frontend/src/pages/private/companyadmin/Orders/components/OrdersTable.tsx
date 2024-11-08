import { useState } from 'react';

import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  Paper,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBuildingCottage,
  IconEye,
  IconFileAlert,
  IconPencil,
} from '@tabler/icons-react';
import { AxiosError } from 'axios';
import EmptyState from 'components/states/EmptyState';
import Table from 'components/Table';
import { Order } from 'types/generated';

import ModalEditOrder from './ModalEditOrder.tsx';
import OrderItemsModal from './OrderItemsModal.tsx';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  isSuccess: boolean;
  isFetching: boolean;
  isError: boolean;
  error: AxiosError<{ message: string }, any> | null;
}

const OrdersTable = ({
  orders,
  isSuccess,
  isLoading,
  isFetching,
  isError,
  error,
}: OrdersTableProps) => {
  const theme = useMantineTheme();
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('');

  const [
    isDeleteModalOpened,
    { close: closeDeleteModal, open: openDeleteModal },
  ] = useDisclosure(false);

  const handleCloseDeleteModal = () => {
    closeDeleteModal();
  };

  // edit status modal
  const [isEditModalOpened, { close: closeEditModal, open: openEditModal }] =
    useDisclosure(false);

  const handleCloseEditModal = () => {
    closeEditModal();
  };

  const columns = [
    {
      Header: 'Branch',
      accessor: 'branch.name',
    },
    {
      Header: 'Total Price',
      accessor: 'totalPrice',
    },
    {
      Header: 'Delivery Date',
      accessor: 'deliveryDate',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }: { value: Order['status'] }) => (
        <Badge variant='outline'>{value}</Badge>
      ),
    },
    {
      Header: 'Order Items',
      name: 'action',
      Cell: ({ row }: { row: { original: Order } }) => (
        <Group>
          <Tooltip label='View Order Items'>
            <ActionIcon
              onClick={() => {
                setOrderId(row.original.id);
                openDeleteModal();
              }}
              variant='light'
              color='yellow'
              size='lg'
            >
              <IconEye size={theme.fontSizes.lg} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Change The Status'>
            <ActionIcon
              onClick={() => {
                setOrderId(row.original.id);
                setStatus(row.original.status);
                openEditModal();
              }}
              variant='light'
              color='green'
              size='lg'
            >
              <IconPencil size={theme.fontSizes.lg} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];

  return (
    <Paper my='lg'>
      <Table
        data={orders}
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
            {isSuccess && orders.length === 0 && (
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

      <OrderItemsModal
        orderId={orderId}
        opened={isDeleteModalOpened && !!orderId.length}
        onClose={handleCloseDeleteModal}
      />

      <ModalEditOrder
        status={status}
        orderId={orderId}
        opened={isEditModalOpened && !!orderId.length && !!status}
        onClose={handleCloseEditModal}
      />
    </Paper>
  );
};

export default OrdersTable;
