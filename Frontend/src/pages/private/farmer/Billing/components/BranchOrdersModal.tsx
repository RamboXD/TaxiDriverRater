import { useEffect, useState } from 'react';

import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Modal,
  ModalProps,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBuildingCottage,
  IconFileAlert,
  IconFileInvoice,
} from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';
import Table from 'components/Table';
import dayjs from 'dayjs';
import useInvoiceOrder from 'hooks/invoice/useInvoiceOrder';
import useOrders from 'hooks/order/useOrders';
import { Order } from 'types/generated';
import generateOrderPDFDocument from '../../Invoice/OrderInvoice';

interface ModalDeleteFarmProps extends Pick<ModalProps, 'opened' | 'onClose'> {
  branchId: string;
  transactionId: string;
}

const BranchOrdersModal = ({
  opened,
  onClose,
  branchId,
  transactionId,
}: ModalDeleteFarmProps) => {
  const theme = useMantineTheme();
  const [branchData, setBranchData] = useState<Order[]>([]);
  const { data, isSuccess, isLoading, isFetching, isError, error } = useOrders({
    branchId,
    transactionId,
  });
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [invoiceData, setInvoiceData] = useState<any>();
  const { data: getInvoiceData, isSuccess: isInvoiceSuccess } = useInvoiceOrder(
    {
      orderId: selectedInvoiceId,
      enabled: !!selectedInvoiceId,
    },
  );
  useEffect(() => {
    if (isInvoiceSuccess && invoiceData) {
      generateOrderPDFDocument(invoiceData);
      setSelectedInvoiceId('');
      setInvoiceData(undefined);
    }
  }, [isInvoiceSuccess, invoiceData]);
  useEffect(() => {
    if (isInvoiceSuccess && getInvoiceData?.data) {
      setInvoiceData(getInvoiceData?.data || []);
    }
  }, [isInvoiceSuccess, getInvoiceData?.data]);

  const columns = [
    // {
    //   Header: 'Status',
    //   accessor: 'status',
    //   Cell: ({ value }: { value: Order['status'] }) => {
    //     let color = 'green';
    //     if (['declined', 'canceled'].includes(value)) {
    //       color = 'red';
    //     }
    //     if (['packaging', 'delivery'].includes(value)) {
    //       color = 'orange';
    //     }
    //     if (['created'].includes(value)) {
    //       color = 'indigo';
    //     }
    //
    //     return <Badge color={color}>{value}</Badge>;
    //   },
    // },
    {
      Header: 'Order Date',
      accessor: 'createdAt',
      Cell: ({ value }: { value: string }) => (
        <Text italic>{dayjs(value).format('DD/MM/YYYY HH:MM')}</Text>
      ),
    },
    {
      Header: 'Delivery Date',
      accessor: 'deliveryDate',
      Cell: ({ value }: { value: string }) => (
        <Text italic>{dayjs(value).format('DD/MM/YYYY')}</Text>
      ),
    },
    {
      Header: 'Total Price',
      accessor: 'totalPrice',
    },
    {
      Header: 'Actions',
      Cell: ({ row }: { row: { original: Order } }) => (
        <Group spacing='xs'>
          <Tooltip label='Invoice'>
            <ActionIcon
              variant='light'
              color='orange'
              size='lg'
              onClick={() => setSelectedInvoiceId(row.original.id)}
            >
              <IconFileInvoice size={theme.fontSizes.lg} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];

  const TableEmptyStatement = () => (
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
          title='No incomming orders'
          description='There are no branch orders to display'
          Icon={
            <Avatar radius='100%' size='xl' variant='light' color='primary'>
              <IconBuildingCottage size={25} />
            </Avatar>
          }
        />
      )}
    </>
  );

  useEffect(() => {
    if (isSuccess && data?.data) {
      setBranchData(data?.data.results || []);
    }
  }, [isSuccess, data?.data]);

  return (
    <Modal
      size='xl'
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>{branchData[0]?.branch.name} Orders</Title>}
      centered
    >
      <Table
        data={branchData}
        columns={columns}
        isLoading={isLoading || isFetching}
        EmptyState={<TableEmptyStatement />}
      />
      <Group mt='lg' position='right'>
        <Button variant='default' onClick={onClose}>
          Close
        </Button>
      </Group>
    </Modal>
  );
};

export default BranchOrdersModal;
