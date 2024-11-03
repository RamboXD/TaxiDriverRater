import { useEffect, useState } from 'react';

import {
  Collapse,
  Highlight,
  List,
  Modal,
  ModalProps,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  ActiveElement,
  ArcElement,
  Chart,
  ChartEvent,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type Item = {
  title: string;
  value: number;
};

type Data = {
  label: string;
  backgroundColor: string;
  borderColor: string;
  totalValue: number;
  items: Item[];
};

const valueChoices = [12, 34, 54, 42, 56, 34, 23, 85, 94, 75]
const totalSalesChoices = [10000000, 15000000, 20000000];
const productRevenueChoices = [250000, 300000, 350000];
const volumeChoices = [100000, 120000, 140000];

const AnalyticsModal = ({
  opened,
  onClose,
  name,
}: Pick<ModalProps, 'opened' | 'onClose'> & { name: string }) => {
  const theme = useMantineTheme();
  const [formattedData, setFormattedData] = useState<Data[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [productRevenue, setProductRevenue] = useState(0);
  const [volume, setVolume] = useState(0);

  const [detailItem, setDetailItem] = useState<
    (typeof formattedData)[0] | null
  >(null);

  useEffect(() => {
    setFormattedData([
      {
        label: 'Potatoes',
        backgroundColor: theme.colors.yellow[0],
        borderColor: theme.colors.yellow[1],
        totalValue: valueChoices[Math.floor(Math.random() * 10)],
        items: [
          { title: 'Kennebec', value: 50 },
          { title: 'Purple Majesty', value: 25 },
          { title: 'Princess Laratte', value: 25 }
        ],
      },
      {
        label: 'Watermelon',
        backgroundColor: theme.colors.pink[0],
        borderColor: theme.colors.pink[1],
        totalValue: valueChoices[Math.floor(Math.random() * 10)],
        items: [
          { title: 'Blacktail Mountain', value: 24 },
          { title: 'Sugar Baby', value: 26 },
          { title: 'Little Darling Hybrid', value: 50 }
        ],
      },
      {
        label: 'Peanuts',
        backgroundColor: theme.colors.blue[0],
        borderColor: theme.colors.blue[1],
        totalValue: valueChoices[Math.floor(Math.random() * 10)],
        items: [{ title: 'Jumbo Virginia', value: 100 }],
      },
      {
        label: 'Lettuce',
        backgroundColor: theme.colors.green[0],
        borderColor: theme.colors.green[1],
        totalValue: valueChoices[Math.floor(Math.random() * 10)],
        items: [
          { title: 'Looseleaf Blend', value: 30 },
          { title: 'Burpee Bibb', value: 30 },
          { title: 'Vivian', value: 40 }
        ],
      },
    ])

    setTotalSales(totalSalesChoices[Math.floor(Math.random() * 3)]);
    setProductRevenue(productRevenueChoices[Math.floor(Math.random() * 3)]);
    setVolume(volumeChoices[Math.floor(Math.random() * 3)]);
  }, [opened])

  const data = {
    labels: formattedData.map((i) => i.label),
    datasets: [
      {
        label: '% of sales',
        data: formattedData.map((i) => i.totalValue),
        backgroundColor: formattedData.map((i) => i.backgroundColor),
        borderColor: formattedData.map((i) => i.borderColor),
        borderWidth: 1,
      },
    ],
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title={<Title order={3}>{`${name} Analytics`}</Title>}
      keepMounted={false}
      size='xl'
    >
      <SimpleGrid cols={2}>
        <Paper sx={{ position: 'relative' }}>
          <Pie
            data={data}
            options={{
              onClick: (_: ChartEvent, __: ActiveElement[], chart: Chart) => {
                const clicked = formattedData.find(
                  (i) => i.label === chart.tooltip?.title[0],
                );

                setDetailItem(clicked as any);
              },
            }}
          />
        </Paper>

        <Stack>
          {detailItem && (
            <Collapse in={!!detailItem}>
              <Paper
                radius='xs'
                withBorder
                p='md'
                bg={detailItem?.backgroundColor}
              >
                <Stack>
                  <Title order={3}>{detailItem?.label}</Title>

                  <List>
                    {detailItem?.items.map((i) => (
                      <List.Item key={i.title}>
                        <Highlight
                          highlightColor='cyan'
                          highlight={`${i.value}%`}
                        >
                          {`${i.title} - ${i.value}%`}
                        </Highlight>
                      </List.Item>
                    ))}
                  </List>
                </Stack>
              </Paper>
            </Collapse>
          )}

          <Stack spacing={0}>
            <Text>Total: ${totalSales.toLocaleString()}</Text>
            <Text>Product + Volume: ${productRevenue.toLocaleString()} + {volume.toLocaleString()}kgs</Text>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Modal>
  );
};

export default AnalyticsModal;
