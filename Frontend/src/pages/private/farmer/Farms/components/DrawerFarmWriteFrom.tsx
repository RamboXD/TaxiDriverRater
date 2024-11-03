import {
  Button,
  Drawer,
  DrawerProps,
  Group,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useShallowEffect } from '@mantine/hooks';
import CountrySelect from 'components/auto-completes/CountrySelect';
import { useAuth } from 'contexts/AuthContext';
import useCreateFarm from 'hooks/farm/useCreateFarm';
import useUpdateFarm from 'hooks/farm/useUpdateFarm';
import { Address, GmOwner, GrossMarket } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface FormValues {
  name: string;
  address: Address | null;
}

interface DrawerFarmWriteFromProps
  extends Pick<DrawerProps, 'opened' | 'onClose'> {
  farm?: GrossMarket;
  title: string;
}

const DrawerFarmWriteFrom = ({
  farm,
  opened,
  onClose,
  title,
}: DrawerFarmWriteFromProps) => {
  const { farmerProfile }: { farmerProfile: GmOwner } = useAuth();

  const createFarmMutation = useCreateFarm();
  const updateFarmMutation = useUpdateFarm(farm?.id);

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      address: null,
    },
  });

  const handleResetAndClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (formValues: FormValues) => {
    if (farm) {
      const updatePayload = {
        ...formValues,
        id: farm.id,
      };

      updateFarmMutation.mutate(updatePayload, {
        onSuccess: (response) => {
          showSuccessNotification(
            'Farm update is success',
            `${response.data.name} has been updated.`,
          );
          handleResetAndClose();
        },
        onError: (error) => {
          showErrorNotification(
            'Farm update failed',
            error.response?.data.message || error.message,
          );
        },
      });
    } else {
      const createPayload = {
        ...formValues,
        farmer: farmerProfile.id,
      };

      createFarmMutation.mutate(createPayload, {
        onSuccess: (response) => {
          showSuccessNotification(
            'Farm creation is success',
            `${response.data.name} has been created.`,
          );
          handleResetAndClose();
        },
        onError: (error) => {
          showErrorNotification(
            'Farm creation failed',
            error.response?.data.message || error.message,
          );
        },
      });
    }
  };

  useShallowEffect(() => {
    if (farm) {
      form.setFieldValue('name', farm.name);
      form.setFieldValue('address', farm?.address || null);
    }
  }, [farm]);

  return (
    <Drawer
      opened={opened}
      onClose={handleResetAndClose}
      title={<Title order={3}>{title}</Title>}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing='xs'>
          <TextInput label='Name' {...form.getInputProps('name')} />
          <Group noWrap grow>
            <CountrySelect label='Country' disabled />
            <TextInput label='City' disabled />
          </Group>
          <TextInput label='Street' disabled />
          <TextInput label='Postcode' disabled />
          <Group noWrap grow>
            <TextInput label='Longitude' disabled />
            <TextInput label='Latitude' disabled />
          </Group>

          <Group position='right' mt='xl'>
            <Button
              variant='subtle'
              onClick={handleResetAndClose}
              disabled={
                createFarmMutation.isLoading || updateFarmMutation.isLoading
              }
            >
              Cancel
            </Button>
            <Button
              type='submit'
              loading={
                createFarmMutation.isLoading || updateFarmMutation.isLoading
              }
            >
              {farm ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};

export default DrawerFarmWriteFrom;
