import {
  Button,
  Drawer,
  DrawerProps,
  Group,
  NumberInput,
  Stack,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import BranchAutocomplete from 'components/auto-completes/BranchAutocomplete';
import dayjs from 'dayjs';
import useCreateOrder from 'hooks/order/useCreateOrder';
import { DynamicAutoCompleteValue } from 'types';
import { OrderCreate, Product } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface FormValues {
  expectedDate: Date;
  branch: DynamicAutoCompleteValue;
  requiredVolume: number;
}

interface DrawerOrderWriteFormProps
  extends Pick<DrawerProps, 'opened' | 'onClose'> {
  advert?: Product;
  title: string;
}

const DrawerOrderWriteForm = ({
  advert,
  opened,
  onClose,
  title,
}: DrawerOrderWriteFormProps) => {
  const createOrderMutation = useCreateOrder();

  const nextWeekDate = new Date();
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);

  const form = useForm<FormValues>({
    initialValues: {
      expectedDate: nextWeekDate,
      branch: { value: '', label: '' },
      requiredVolume: 0,
    },

    validate: {
      requiredVolume: (value) =>
        value > 0 ? null : 'Volume should be more than 0',
    },
  });

  const handleResetAndClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (formValues: FormValues) => {
    if (advert) {
      const createPayload = {
        branch: formValues.branch.value,
        deliveryDate: dayjs(formValues.expectedDate).format('YYYY-MM-DD'),
        status: 'created' as OrderCreate['status'],
        orderItems: []
      };

      createOrderMutation.mutate(createPayload, {
        onSuccess: () => {
          showSuccessNotification(
            'Order creation is success',
            `${advert.name} order has been created.`,
          );
          handleResetAndClose();
        },
        onError: (error) => {
          showErrorNotification(
            'Order creation failed',
            error.response?.data.message || error.message,
          );
        },
      });
    }
  };

  const handleBranchChange = (item: DynamicAutoCompleteValue | null) => {
    form.setFieldValue('branch', {
      value: item?.value || '',
      label: item?.label || '',
    });
  };

  return (
    <Drawer
      opened={opened}
      onClose={handleResetAndClose}
      title={<Title order={3}>{title}</Title>}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing='xs'>
          <NumberInput
            label='Required volume'
            placeholder='Type in kg'
            min={0}
            required
            {...form.getInputProps('requiredVolume')}
          />
          <DateInput
            label='Expected date'
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

          <Group position='right' mt='xl' grow>
            <Button
              variant='outline'
              onClick={handleResetAndClose}
              disabled={createOrderMutation.isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' loading={createOrderMutation.isLoading}>
              Create
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};

export default DrawerOrderWriteForm;
