import {
  Button,
  Drawer,
  DrawerProps,
  Group,
  NumberInput,
  Stack,
  Text
} from '@mantine/core';
import { useForm } from '@mantine/form';
import useUpdateQuality from 'hooks/quality/useUpdateQuality';
import { Advert } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface FormValues {
  priceSell: number;
  volume: number;
}

interface DrawerFarmWriteFromProps
  extends Pick<DrawerProps, 'opened' | 'onClose'> {
  advert: Advert;
  title: string;
}

const DrawerProductWriteFrom = ({
  advert,
  opened,
  onClose,
  title,
}: DrawerFarmWriteFromProps) => {
  const updateAdvertMutation = useUpdateQuality(advert.qualitiesOfAdvert[0].id);

  const nextWeekDate = new Date();
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);

  const initialValues = {
    priceSell: advert.qualitiesOfAdvert[0].priceSell,
    volume: advert.qualitiesOfAdvert[0].volume
  }

  const form = useForm<FormValues>({
    initialValues,
  });


  const handleResetAndClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (formValues: FormValues) => {
    const payload = {
      priceSell: formValues.priceSell,
      volume: formValues.volume
    };

    updateAdvertMutation.mutate(payload, {
      onSuccess: () => {
        showSuccessNotification('Advert update is success');
        handleResetAndClose();
      },
      onError: (error: any) => {
        showErrorNotification(
          'Advert update failed',
          error.response?.data.message || error.message,
        );
      },
    });
  };

    
  return (
    <Drawer
      opened={opened}
      onClose={handleResetAndClose}
      title={<Text size='xl' fw={700}>{title}</Text>}
      sx={{ position: 'relative' }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing='xs'>
          <NumberInput
            label='Volume'
            placeholder='Type in kg'
            min={0}
            required
            {...form.getInputProps(`volume`)}
          />
          <NumberInput
            label='Price'
            prefix="$"
            placeholder='Price for the product'
            min={0}
            required
            {...form.getInputProps(`priceSell`)}
          />
        </Stack>

        <Group position='right' mt='lg'>
          <Button
            variant='subtle'
            onClick={handleResetAndClose}
          >
            Cancel
          </Button>
          <Button type='submit'>
            {advert ? 'Update' : 'Create'}
          </Button>
        </Group>
      </form>
    </Drawer>
  );
};

export default DrawerProductWriteFrom;
