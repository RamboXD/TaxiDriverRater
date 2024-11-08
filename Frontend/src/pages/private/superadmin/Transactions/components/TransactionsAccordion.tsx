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
import EmptyState from 'components/states/EmptyState';
import Table from 'components/Table';
import dayjs from 'dayjs';
import useTransactions from 'hooks/transactions/useTransactions';
import { CompanyInvoice, GrossMarket, Transaction } from 'types/generated';

import AnalyticsModal from '../../../../../components/modals/AnalyticsModal.tsx';
import ChangeTransactionModal from './ChangeTransactionModal.tsx';
import TransactionBranchesCollapse from './TransactionBranchesCollapse.tsx';
import useInvoiceCompany from 'hooks/invoice/useInvoiceCompany.ts';
import generatePDFDocument from 'pages/private/companyadmin/Invoice/Invoice.tsx';

interface TransactionsAccordionProps {
  grossMarket: GrossMarket;
  completed: boolean;
}

const statusTooltip = (status: Transaction['status']) => {
  if (status == 'completed') {
    return 'Transaction is completed successfully.';
  } else if (status == 'confirm') {
    return 'Wholesale is confirming...';
  } else if (status == 'payment') {
    return 'Waiting for payment...';
  }
  // pending
  return 'Waiting for the wholesale.';
};

const TransactionsAccordion = ({
  grossMarket,
  completed,
}: TransactionsAccordionProps) => {
  const theme = useMantineTheme();

  const { data, isLoading, isSuccess } = useTransactions({
    completed,
  });

  const [
    isAnalyticsModalOpened,
    { open: openAnalytics, close: closeAnalytics },
  ] = useDisclosure(false);
  const [openedTransactions, setOpenedTransactions] = useState<string[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleOpenBranch = (transactionId: string) => {
    setOpenedTransactions((prev) => {
      if (prev.includes(transactionId)) {
        return prev.filter((id) => id !== transactionId);
      }
      return [...prev, transactionId];
    });
  };

  const [invoiceData, setInvoiceData] = useState<CompanyInvoice>();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');

  const { data: getInvoiceData, isSuccess: isInvoiceSuccess } =
    useInvoiceCompany({
      transactionId: selectedInvoiceId,
      enabled: !!selectedInvoiceId,
    });
  useEffect(() => {
    if (isInvoiceSuccess && invoiceData) {
      generatePDFDocument(invoiceData);
      setSelectedInvoiceId('');
      setInvoiceData(undefined);
    }
  }, [isInvoiceSuccess, invoiceData]);

  useEffect(() => {
    if (isInvoiceSuccess && getInvoiceData?.data) {
      setInvoiceData(getInvoiceData?.data || []);
    }
  }, [isInvoiceSuccess, getInvoiceData?.data]);
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
      <>
        <Group spacing='xs'>
          <Tooltip label='Change The Status'>
            <ActionIcon
              onClick={() => {
                setSelectedTransaction(row.original);
              }}
              disabled={
                row.original.status === 'pending' ||
                row.original.status === 'confirm' ||
                row.original.status === 'completed'
              }
              variant='outline'
              color='green'
              size='lg'
            >
              <IconPencil size={theme.fontSizes.lg} />
            </ActionIcon>
          </Tooltip>
          {/* {completed && ( */}
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
          {/* )} */}
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
      </>
    ),
  };

  const memoizedColumns = useMemo(() => {
    if (completed) {
      return [totalPaymentAmountColumn, paymnetDateColumn, actionsColumn];
    }

    return [
      statusColumn,
      totalPaymentAmountColumn,
      cashRationCoeffitient,
      paymnetDateColumn,
      actionsColumn,
    ];
  }, [completed]);

  return (
    <>
      <Accordion chevronPosition='left' variant='separated' radius='lg'>
        <Accordion.Item value='customization'>
          <Accordion.Control>
            <Group position='apart'>
              <Title color='dark.4' order={5} weight={700}>
                {grossMarket.name}
              </Title>

              {completed && (
                <Button
                  variant='light'
                  leftIcon={<IconDeviceAnalytics size={theme.fontSizes.lg} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    openAnalytics();
                  }}
                >
                  Analytics By Wholesaler
                </Button>
              )}
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              {isSuccess && !data?.data.results.length && (
                <EmptyState
                  mt='xl'
                  title='No Branches'
                  description='There are no branches with active transactions to display.'
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
              {data?.data.results.map((transaction) => (
                <Paper key={transaction.id} shadow='xs' bg='gray.0'>
                  <Table
                    key={transaction.id}
                    data={[transaction]}
                    columns={memoizedColumns}
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
                    opened={openedTransactions.includes(transaction.id)}
                    completed={completed}
                    transactionId={transaction.id}
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
        name={grossMarket.name}
        onClose={closeAnalytics}
      />
    </>
  );
};

export default TransactionsAccordion;
