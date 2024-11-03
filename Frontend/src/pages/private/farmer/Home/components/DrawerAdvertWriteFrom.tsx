import {
  Button,
  Drawer,
  DrawerProps,
  Group,
  NumberInput,
  Select,
  Stack,
  Text
} from '@mantine/core';
import { useForm } from '@mantine/form';
import ProductAutocomplete from 'components/auto-completes/ProductAutocomplete';
import ProductSortAutocomplete from 'components/auto-completes/ProductSortAutocomplete';
import useCreateAdvert from 'hooks/advert/useCreateAdvert';
import useUpdateAdvert from 'hooks/advert/useUpdateAdvert';
import { DynamicAutoCompleteValue } from 'types';
import { Advert, QualityCreate } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface FormValues {
  product: DynamicAutoCompleteValue;
  qualitiesOfAdvert: QualityCreate[];
  sort: DynamicAutoCompleteValue;
}

interface DrawerFarmWriteFromProps
  extends Pick<DrawerProps, 'opened' | 'onClose'> {
  advert?: Advert;
  title: string;
}

const DrawerAdvertWriteFrom = ({
  advert,
  opened,
  onClose,
  title,
}: DrawerFarmWriteFromProps) => {
  const createAdvertMutation = useCreateAdvert();
  const updateAdvertMutation = useUpdateAdvert(advert?.id);

  const nextWeekDate = new Date();
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);

  const initialValues = advert
    ? {
        product: {
          value: advert.product.id,
          label: advert.product.name,
        },
        qualitiesOfAdvert: [{
          name: advert.qualitiesOfAdvert[0].name,
          priceSell: advert.qualitiesOfAdvert[0].priceSell,
          volume: advert.qualitiesOfAdvert[0].volume
        }],
        sort: {
          value: advert.sort.id,
          label: advert.sort.name,
        },
      }
    : {
        product: { value: '', label: '' },
        qualitiesOfAdvert: [{ name: '', priceSell: 0, volume: 0}],
        sort: { value: '', label: '' },
      };

  const form = useForm<FormValues>({
    initialValues,
  });

  const actionButtonsDisabled =
    createAdvertMutation.isLoading || updateAdvertMutation.isLoading;

  const handleSortChange = (item: DynamicAutoCompleteValue | null) => {
    form.setFieldValue('sort', {
      value: item?.value || '',
      label: item?.label || '',
    });
  };
  const handleProductChange = (item: DynamicAutoCompleteValue | null) => {
    form.setFieldValue('product', {
      value: item?.value || '',
      label: item?.label || '',
    });
  };

  const handleResetAndClose = () => {
    form.reset();
    onClose();
  };

  const handleQualityAdd = () => {
    form.insertListItem('qualitiesOfAdvert', {
      name: '',
      priceSell: 0,
      volume: 0
    })
  }

  const handleSubmit = (formValues: FormValues) => {
    if (advert) {
      const payload = {
        priceSell: formValues.qualitiesOfAdvert[0].priceSell,
        volume: formValues.qualitiesOfAdvert[0].volume
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
    } else {
      const createPayload = {
        product: formValues.product.value,
        sort: formValues.sort.value,
        qualitiesOfAdvert: formValues.qualitiesOfAdvert,
      };

      createAdvertMutation.mutate(createPayload, {
        onSuccess: () => {
          showSuccessNotification('Advert creation is success');
          form.reset();
          onClose();
        },
        onError: (error) => {
          showErrorNotification(
            'Advert creation failed',
            error.response?.data.message || error.message,
          );
        },
      });
    }
  };

  const qualityFeilds = form.values.qualitiesOfAdvert.map((item, index) => (
    <Stack spacing='xs' key={item.name}>
      <Select
        label='Food class'
        placeholder='Select product sort quality'
        data={[
                { value: 'I', label: 'I' },
                { value: 'II', label: 'II', disabled: true },
                { value: 'III', label: 'III', disabled: true }
              ]}
        required
        {...form.getInputProps(`qualitiesOfAdvert.${index}.name`)}
      />
      <NumberInput
        label='Volume'
        placeholder='Type in kg'
        min={0}
        required
        {...form.getInputProps(`qualitiesOfAdvert.${index}.volume`)}
      />
      <NumberInput
        label='Price'
        placeholder='Price for the product'
        min={0}
        required
        {...form.getInputProps(`qualitiesOfAdvert.${index}.priceSell`)}
      />
    </Stack>
  ))

  return (
    <Drawer
      opened={opened}
      onClose={handleResetAndClose}
      title={<Text size='xl'>{title}</Text>}
      sx={{ position: 'relative' }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing='xs'>
          <ProductAutocomplete
            label='Product'
            placeholder='Select product'
            value={form.values.product}
            onChange={handleProductChange}
            disabled={!!advert}
            required
          />
          <ProductSortAutocomplete
            productId={form.values.product.value}
            label='Sort'
            placeholder='Select product sort'
            value={form.values.sort}
            onChange={handleSortChange}
            disabled={!!advert}
            required
          />
          {qualityFeilds}
          <Group mt="sm">
            <Button disabled onClick={handleQualityAdd}>Add Quality</Button>
          </Group>
        </Stack>

        <Group position='right' mt='lg'>
          <Button
            variant='subtle'
            onClick={handleResetAndClose}
            disabled={actionButtonsDisabled}
          >
            Cancel
          </Button>
          <Button type='submit' loading={actionButtonsDisabled}>
            {advert ? 'Update' : 'Create'}
          </Button>
        </Group>
      </form>
    </Drawer>
  );
};

export default DrawerAdvertWriteFrom;
