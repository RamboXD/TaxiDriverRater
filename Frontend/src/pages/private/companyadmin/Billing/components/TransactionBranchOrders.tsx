import { Avatar, Collapse, Paper } from '@mantine/core';
import { IconBuildingCottage, IconFileAlert } from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';
import Table from 'components/Table';
import useOrders from 'hooks/order/useOrders';

interface TransactionBranchOrdersProps {
  transactionId: string;
  branchId: string;
  opened: boolean;
}

const TransactionBranchOrders = ({
  transactionId,
  branchId,
  opened,
}: TransactionBranchOrdersProps) => {
  const { data, isLoading, isSuccess, isError, isFetching } = useOrders({
    transactionId,
    branchId,
  });

  const columns = [
    {
      Header: 'Branches',
      accessor: 'name',
    },
    {
      Header: 'Amount',
      accessor: 'totalOrderPrice',
    },
  ];

  return (
    <Collapse in={opened}>
      asd
      <Paper shadow='md' bg='green.1'>
        <Table
          data={[data?.data] || []}
          columns={columns}
          isLoading={isLoading || isFetching}
          EmptyState={
            <>
              {isError && (
                <EmptyState
                  mt='xl'
                  title='Error'
                  description='Something went wrong while fetching data.'
                  Icon={
                    <Avatar radius='100%' size='xl' variant='light' color='red'>
                      <IconFileAlert size={25} />
                    </Avatar>
                  }
                />
              )}
              {isSuccess && !data?.data && (
                <EmptyState
                  mt='xl'
                  title='No Orders'
                  description='There are no orders to display.'
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
    </Collapse>
  );
};

export default TransactionBranchOrders;
