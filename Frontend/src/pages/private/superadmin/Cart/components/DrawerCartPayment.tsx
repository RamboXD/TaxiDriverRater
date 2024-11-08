import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Drawer,
  DrawerProps,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconCreditCard, IconShoppingCart } from '@tabler/icons-react';
import BranchAutocomplete from 'components/auto-completes/BranchAutocomplete';
import dayjs from 'dayjs';
import { useCart } from 'hooks/cart/useCart';
import useCreateOrder from 'hooks/order/useCreateOrder';
import { Link } from 'react-router-dom';
import { DynamicAutoCompleteValue } from 'types';
import { Advert, OrderCreate } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface DrawerCartSummaryProps
  extends Pick<DrawerProps, 'opened' | 'onClose'> {
  orders: Advert[];
  selectedItems: string[];
  onUpdateOrders: (newData: Advert[]) => void;
}

interface FormValues {
  deliveryDate: Date;
  branch: DynamicAutoCompleteValue;
}

const DrawerCartPayment = ({
  opened,
  onClose,
  orders,
  selectedItems,
  onUpdateOrders,
}: DrawerCartSummaryProps) => {
  const theme = useMantineTheme();
  const { removeItem } = useCart();
  const createOrderMutation = useCreateOrder();

  const nextWeekDate = new Date();
  nextWeekDate.setDate(nextWeekDate.getDate() + 1);

  const form = useForm<FormValues>({
    initialValues: {
      deliveryDate: nextWeekDate,
      branch: { value: '', label: '' },
    },
  });

  const handleResetAndClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (formValues: FormValues) => {
    const selectedAdverts = orders.filter((advert) =>
      selectedItems.includes(advert.id),
    );

    const orderItems = selectedAdverts.map((advert) => {
      const quality = advert.qualitiesOfAdvert[0].id;
      const volume = advert.qualitiesOfAdvert[0].volume;

      return { quality, volume };
    });

    const payload = {
      branch: formValues.branch.value,
      deliveryDate: dayjs(formValues.deliveryDate).format('YYYY-MM-DD'),
      status: 'created' as OrderCreate['status'],
      orderItems,
    };

    createOrderMutation.mutate(payload, {
      onSuccess: () => {
        showSuccessNotification('Order successfully created');
        const updatedOrders = orders.filter(
          (order) => !selectedItems.includes(order.id),
        );
        onUpdateOrders(updatedOrders);
        selectedItems.forEach((item) => removeItem(item));
        handleResetAndClose();
      },
      onError: (error) => {
        showErrorNotification(
          'Order creation failed',
          error.response?.data.message || error.message,
        );
      },
    });
  };

  const handleBranchChange = (item: DynamicAutoCompleteValue | null) => {
    form.setFieldValue('branch', {
      value: item?.value || '',
      label: item?.label || '',
    });
  };

  const cartFee = orders.reduce(
    (acc, order) =>
      selectedItems.includes(order.id)
        ? order.qualitiesOfAdvert[0].priceSell *
            order.qualitiesOfAdvert[0].volume +
          acc
        : acc,
    0,
  );

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Make order</Title>}
    >
      <Stack style={{ minWidth: '300px' }}>
        <Title order={2} weight={700}>
          Summary
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing='md'>
            <Stack spacing='xs'>
              <DateInput
                label='Delivery date'
                placeholder='DD/MM/YYYY'
                valueFormat='DD/MM/YYYY'
                minDate={nextWeekDate}
                required
                {...form.getInputProps('expectedDate')}
              />
              <BranchAutocomplete
                label='Branch'
                placeholder='Select branch'
                value={form.values.branch}
                onChange={handleBranchChange}
                required
              />
            </Stack>

            <Divider />

            <Stack spacing='xs'>
              <Group position='apart' noWrap>
                <Text c='dimmed'>Cart:</Text>
                <Text>${cartFee}</Text>
              </Group>
              <Group position='apart' noWrap>
                <Text c='dimmed'>Service fees:</Text>
                <Text>$0</Text>
              </Group>
              <Group position='apart' noWrap>
                <Text c='dimmed'>Shipment:</Text>
                <Text>$0</Text>
              </Group>
              <Group position='apart' noWrap>
                <Text c='dimmed'>Subtotal:</Text>
                <Text size='xl' weight='bold'>
                  ${cartFee}
                </Text>
              </Group>

              <Checkbox
                label={
                  <Text>
                    I have read and agree with the{' '}
                    <Anchor
                      component={Link}
                      to='#'
                      color='green'
                      underline
                      sx={{ textDecoration: 'underline' }}
                    >
                      Terms and Conditions
                    </Anchor>
                  </Text>
                }
                my='md'
              />

              <Button
                type='submit'
                leftIcon={<IconCreditCard size={theme.fontSizes.lg} />}
              >
                Proceed
              </Button>
              <Link to='/' style={{ textDecoration: 'none' }}>
                <Button
                  variant='outline'
                  leftIcon={<IconShoppingCart size={theme.fontSizes.lg} />}
                  fullWidth
                >
                  Continue shopping
                </Button>
              </Link>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Drawer>
  );
};

export default DrawerCartPayment;
