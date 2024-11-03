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
import useGrossMarkets from 'hooks/gross-market/useGrossMarkets';
import { GrossMarket } from 'types/generated';

import TransactionsAccordion from './components/TransactionsAccordion.tsx';
import AnalyticsModal from '../../../../components/modals/AnalyticsModal.tsx';

const Billing = () => {
  const theme = useMantineTheme();

  const [grossMarkets, setGrossMarkets] = useState<GrossMarket[]>([]);
  const [transactionsStatus, setTransactionsStatus] = useState('Pending');
  const [
    isAnalyticsModalOpened,
    { open: openAnalytics, close: closeAnalytics },
  ] = useDisclosure(false);

  const { data, isSuccess } = useGrossMarkets({});

  useEffect(() => {
    if (isSuccess && data?.data) {
      setGrossMarkets(data?.data.results || []);
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

      <Stack>
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

        {grossMarkets.map((gm) => (
          <TransactionsAccordion
            key={gm.id}
            grossMarket={gm}
            completed={transactionsStatus === 'Completed'}
          />
        ))}

        {isSuccess && !grossMarkets.length && (
          <EmptyState
            mt='xl'
            title='No Wholesaler'
            description={`No Wholesales with active transactions.`}
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
