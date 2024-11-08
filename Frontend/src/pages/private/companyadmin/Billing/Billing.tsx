import { useEffect, useState } from 'react';

import {
  Button,
  Divider,
  Flex,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChartPie } from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';
import useCompanyTransactions from 'hooks/company/useCompanyTransactions';
import { CompanyTransactions } from 'types/generated';

import CompanyTransactionsAccordion from './components/CompanyTransactionsAccordion.tsx';
import AnalyticsModal from '../../../../components/modals/AnalyticsModal.tsx';

const Billing = () => {
  const theme = useMantineTheme();

  const [companies, setCompanies] = useState<CompanyTransactions[]>([]);
  const [transactionsStatus, setTransactionsStatus] = useState('Pending');
  const [
    isAnalyticsModalOpened,
    { open: openAnalytics, close: closeAnalytics },
  ] = useDisclosure(false);

  const isCompleted = transactionsStatus === 'Completed';
  const { data, isLoading, isSuccess, isFetching } = useCompanyTransactions({
    completed: isCompleted,
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      setCompanies(data?.data || []);
    }
  }, [isSuccess, data?.data]);

  return (
    <Stack>
      <Flex direction='column'>
        <Title weight={700}>Billing</Title>
        <Text color='dimmed'>Transactions grouped by companies</Text>
      </Flex>

      <Divider my='md' />

      <SegmentedControl
        color='green'
        data={['Pending', 'Completed']}
        value={transactionsStatus}
        onChange={setTransactionsStatus}
      />

      {transactionsStatus === 'Completed' && (
        <Group position='right'>
          <Button
            variant='light'
            color='yellow'
            leftIcon={<IconChartPie size={theme.fontSizes.lg} />}
            onClick={openAnalytics}
          >
            Total Analytics
          </Button>
        </Group>
      )}

      <Stack>
        {companies.map((company) => (
          <CompanyTransactionsAccordion
            key={company.id}
            company={company as any}
            isLoading={isLoading || isFetching}
            isCompleted={isCompleted}
          />
        ))}

        {isSuccess && !companies.length && (
          <EmptyState
            mt='xl'
            title='No billing'
            description={`No billings with ${transactionsStatus.toLowerCase()} status.`}
          />
        )}

        <AnalyticsModal
          opened={isAnalyticsModalOpened}
          onClose={closeAnalytics}
          name='Total'
        />
      </Stack>
    </Stack>
  );
};

export default Billing;
