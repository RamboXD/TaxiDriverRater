import { useEffect, useMemo, useState } from 'react';

import {
  Accordion,
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBuildingCottage,
  IconChevronDown,
  IconDeviceAnalytics,
  IconFileInvoice,
  IconPencil,
} from '@tabler/icons-react';
import AnalyticsModal from 'components/modals/AnalyticsModal';
import EmptyState from 'components/states/EmptyState';
import Table from 'components/Table';
import dayjs from 'dayjs';
import useInvoiceCompany from 'hooks/invoice/useInvoiceCompany';
import {
  CompanyInvoice,
  CompanyTransactions,
  Transaction,
} from 'types/generated';

import generatePDFDocument from '../../Invoice/Invoice.tsx';
import ChangeTransactionModal from './ChangeTransactionModal.tsx';
import TransactionBranchesCollapse from './TransactionBranchesCollapse.tsx';

const statusTooltip = (status: Transaction['status']) => {
  if (status === 'completed') {
    return 'Transaction is completed successfully.';
  }
  if (status === 'confirm') {
    return 'Confirm the payment';
  }
  if (status === 'payment') {
    return 'Waiting for payment';
  }
  // pending
  return 'Set non-cash ratio';
};

const CompanyTransactionsAccordion = ({
  company,
  isLoading,
  isCompleted,
}: {
  company: CompanyTransactions & { transactions: Transaction[] };
  isLoading: boolean;
  isCompleted: boolean;
}) => {
  const theme = useMantineTheme();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [invoiceData, setInvoiceData] = useState<CompanyInvoice>();
  const [
    isAnalyticsModalOpened,
    { open: openAnalytics, close: closeAnalytics },
  ] = useDisclosure(false);
  const [openedBranches, setOpenedBranches] = useState<string[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const { data, isSuccess } = useInvoiceCompany({
    transactionId: selectedInvoiceId,
    enabled: !!selectedInvoiceId,
  });

  const handleOpenBranch = (transactionId: string) => {
    setOpenedBranches((prev) => {
      if (prev.includes(transactionId)) {
        return prev.filter((id) => id !== transactionId);
      }
      return [...prev, transactionId];
    });
  };

  useEffect(() => {
    if (invoiceData) {
      generatePDFDocument(invoiceData);
      setSelectedInvoiceId('');
      setInvoiceData(undefined);
    }
    if (isSuccess && data?.data) {
      setInvoiceData(data?.data || []);
    }
  }, [isSuccess, invoiceData, isSuccess, data?.data]);

  const statusColumn = {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ value }: { value: Transaction['status'] }) => (
      <Tooltip label={statusTooltip(value)}>
        <Badge
          variant='outline'
          color={value === 'pending' ? 'orange' : 'green'}
        >
          {value}
        </Badge>
      </Tooltip>
    ),
  };
  const totalPaymentAmountColumn = {
    Header: 'Total Payment Amount',
    accessor: 'totalPaymentAmount',
  };
  const cashRationCoeffitient = {
    Header: 'Cash Ratio Coefficient',
    accessor: 'nonCashCoef',
    Cell: ({ value }: { value: number }) => <>{value * 100}%</>,
  };
  const paymnetDateColumn = {
    Header: 'Payment Date',
    accessor: 'paymentDate',
    Cell: ({ value }: { value: string }) => (
      <Text italic>{dayjs(value).format('DD/MM/YYYY HH:MM')}</Text>
    ),
  };
  const actionsColumn = {
    Header: 'Actions',
    Cell: ({ row }: { row: { original: Transaction } }) => (
      <Group spacing='xs'>
        <Tooltip label='Change The Status'>
          <ActionIcon
            onClick={() => setSelectedTransaction(row.original)}
            disabled={
              row.original.status === 'payment' ||
              row.original.status === 'completed'
            }
            variant='outline'
            color='green'
            size='lg'
          >
            <IconPencil size={theme.fontSizes.lg} />
          </ActionIcon>
        </Tooltip>
        {/* {isCompleted && ( */}
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
        {/* // )} */}
        <Tooltip label='Branches'>
          <ActionIcon
            variant='default'
            size='lg'
            onClick={() => {
              handleOpenBranch(row.original.id);
            }}
          >
            <IconChevronDown size={theme.fontSizes.lg} />
          </ActionIcon>
        </Tooltip>
      </Group>
    ),
  };

  const memoedColumns = useMemo(() => {
    if (isCompleted) {
      return [totalPaymentAmountColumn, paymnetDateColumn, actionsColumn];
    }

    return [
      statusColumn,
      totalPaymentAmountColumn,
      cashRationCoeffitient,
      paymnetDateColumn,
      actionsColumn,
    ];
  }, [isCompleted]);

  return (
    <>
      <Accordion chevronPosition='left' variant='separated'>
        <Accordion.Item value='customization'>
          <Accordion.Control>
            <Group position='apart'>
              <Title color='dark.4' order={5} weight={700}>
                {company.name}
              </Title>

              {isCompleted && (
                <Button
                  variant='light'
                  leftIcon={<IconDeviceAnalytics size={theme.fontSizes.lg} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    openAnalytics();
                  }}
                >
                  Analytics By Company
                </Button>
              )}
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              {company.transactions.map((transaction) => (
                <Paper shadow='xs' bg='gray.0' key={transaction.id}>
                  <Table
                    key={transaction.id}
                    data={[transaction]}
                    columns={memoedColumns}
                    isLoading={isLoading}
                    EmptyState={
                      <EmptyState
                        mt='xl'
                        title='No farms'
                        description='There are no transactions to display.'
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
                    }
                  />
                  <TransactionBranchesCollapse
                    opened={openedBranches.includes(transaction.id)}
                    transactionId={transaction.id}
                    isCompleted={isCompleted}
                  />
                </Paper>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <ChangeTransactionModal
        transaction={selectedTransaction}
        opened={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      <AnalyticsModal
        opened={isAnalyticsModalOpened}
        name={company.name}
        onClose={closeAnalytics}
      />
    </>
  );
};

export default CompanyTransactionsAccordion;
