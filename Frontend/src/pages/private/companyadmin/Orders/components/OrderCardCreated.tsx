import { Button, Image, Paper, Text, useMantineTheme } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { Order } from 'types/generated';

interface OrderCardCreatedProps {
  order: Order;
  handleOrderClick: (order: Order) => void;
  onDecline: (orderId: string) => void;
  onProceed: (orderId: string) => void;
}

const OrderCardCreated = ({
  order,
  handleOrderClick,
  onDecline,
  onProceed,
}: OrderCardCreatedProps) => {
  const theme = useMantineTheme();
  const handleDecline = () => onDecline(order.id);
  const handleProceed = () => onProceed(order.id);
  return (
    <Paper
      onClick={() => handleOrderClick(order)}
      shadow='lg'
      sx={{
        backgroundColor: 'white',
        marginTop: '20px',
        height: '60px',
        width: '100%',
        borderRadius: theme.radius.md,
        display: 'grid',
        gridTemplateColumns: '40px 1fr 1fr 1fr 1fr', // adjust these values as needed
        alignItems: 'center',
        padding: '0 20px',
        gap: theme.spacing.xs,
      }}
    >
      <Image
        src={'https://cdn.britannica.com/17/196817-159-9E487F15/vegetables.jpg'}
        width={40}
        height={40}
        fit='cover'
        radius={'10px'}
        alt={'Order'}
      />

      <Text size='sm'>{order.branch.address.street || 'Branch address'}</Text>
      <Text size='sm'>{dayjs(order.deliveryDate).format('DD/MM/YYYY')}</Text>

      <Button
        leftIcon={<IconX />}
        size='sm'
        color='red'
        variant='light'
        onClick={handleDecline}
      >
        <Text size='xs'>Decline</Text>
      </Button>
      <Button
        leftIcon={<IconCheck />}
        size='sm'
        color='green'
        variant='light'
        onClick={handleProceed}
      >
        <Text size='xs'>Proceed</Text>
      </Button>
    </Paper>
  );
};

export default OrderCardCreated;
