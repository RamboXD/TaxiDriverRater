import { useEffect, useState } from 'react';

import {
  ActionIcon,
  Avatar,
  Collapse,
  Group,
  Paper,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBuildingCottage,
  IconChartPie,
  IconEye,
  IconFileAlert,
  IconFileInvoice,
} from '@tabler/icons-react';
import AnalyticsModal from 'components/modals/AnalyticsModal';
import EmptyState from 'components/states/EmptyState';
import Table from 'components/Table';
import useTransactionBranches from 'hooks/branch/useTransactionBranches';

import { BranchInvoice, TransactionBranches } from 'types/generated';

import BranchOrdersModal from './BranchOrdersModal.tsx';
import useInvoiceBranch from 'hooks/invoice/useInvoiceBranch.ts';
import generateBranchPDFDocument from '../../Invoice/BranchInvoice.tsx';

interface TransactionBranchesCollapseProps {
  opened: boolean;
  transactionId: string;
  isCompleted: boolean;
}

const TransactionBranchesCollapse = ({
  opened,
  transactionId,
  isCompleted,
}: TransactionBranchesCollapseProps) => {
  const theme = useMantineTheme();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [invoiceData, setInvoiceData] = useState<BranchInvoice>();

  const [
    isAnalyticsModalOpened,
    { open: openAnalytics, close: closeAnalytics },
  ] = useDisclosure(false);
  const [branchId, setBranchId] = useState('');
  const [
    isOrdersModalOpened,
    { close: closeOrdersModal, open: openOrdersModal },
  ] = useDisclosure(false);

  const { data, isLoading, isError, isSuccess, isFetching } =
    useTransactionBranches({
      transactionId,
    });

  const { data: getInvoiceData, isSuccess: isInvoiceSucces } = useInvoiceBranch(
    {
      transactionId,
      branchId: selectedInvoiceId,
      enabled: !!selectedInvoiceId,
    },
  );

  useEffect(() => {
    if (isInvoiceSucces && invoiceData) {
      generateBranchPDFDocument(invoiceData);
      setSelectedInvoiceId('');
      setInvoiceData(undefined);
    }
  }, [isInvoiceSucces, invoiceData]);

  useEffect(() => {
    if (isInvoiceSucces && getInvoiceData?.data) {
      setInvoiceData(getInvoiceData?.data || []);
    }
  }, [isInvoiceSucces, getInvoiceData?.data]);

  const columns = [
    {
      Header: 'Branches',
      accessor: 'name',
    },
    {
      Header: 'Amount',
      accessor: 'totalOrderPrice',
    },
    {
      Header: 'Actions',
      Cell: ({ row }: { row: { original: TransactionBranches } }) => (
        <Group spacing='xs'>
          <Tooltip label='View Orders'>
            <ActionIcon
              onClick={() => {
                setBranchId(row.original.id);
                openOrdersModal();
              }}
              variant='light'
              color='yellow'
              size='lg'
            >
              <IconEye size={theme.fontSizes.lg} />
            </ActionIcon>
          </Tooltip>
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
          {isCompleted && (
            <Tooltip label='Analitycs by Branch'>
              <ActionIcon
                variant='light'
                color='blue'
                size='lg'
                onClick={openAnalytics}
              >
                <IconChartPie size={theme.fontSizes.lg} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      ),
    },
  ];

  const TableEmptyState = (
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
      {isSuccess && data?.data.length === 0 && (
        <EmptyState
          mt='xl'
          title='No farms'
          description='There are no transactions to display.'
          Icon={
            <Avatar radius='100%' size='xl' variant='light' color='primary'>
              <IconBuildingCottage size={25} />
            </Avatar>
          }
        />
      )}
    </>
  );

  return (
    <Collapse in={opened}>
      <Paper shadow='sm' bg='green.0'>
        <Table
          data={data?.data || []}
          columns={columns}
          isLoading={isLoading || isFetching}
          EmptyState={TableEmptyState}
        />
      </Paper>

      <BranchOrdersModal
        branchId={branchId}
        transactionId={transactionId}
        opened={isOrdersModalOpened}
        onClose={closeOrdersModal}
      />

      <AnalyticsModal
        opened={isAnalyticsModalOpened}
        name='Branch'
        onClose={closeAnalytics}
      />
    </Collapse>
  );
};

export default TransactionBranchesCollapse;
