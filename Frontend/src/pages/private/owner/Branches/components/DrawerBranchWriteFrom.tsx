import {
  Button,
  Drawer,
  DrawerProps,
  Group,
  Radio,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useShallowEffect } from '@mantine/hooks';
import CountrySelect from 'components/auto-completes/CountrySelect';
import { useAuth } from 'contexts/AuthContext';
import useCreateBranch from 'hooks/branch/useCreateBranch';
import useUpdateBranch from 'hooks/branch/useUpdateBranch';
import { Address, Branch, CompanyProfile } from 'types/generated/index';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';
import { emailValidator } from 'utils/validations';

interface FormValues {
  name: string;
  email: string | null;
  phone: string;
  address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>;
}

interface DrawerFarmWriteFromProps
  extends Pick<DrawerProps, 'opened' | 'onClose'> {
  branch?: Branch;
  title: string;
}

const DrawerBranchWriteFrom = ({
  branch,
  opened,
  onClose,
  title,
}: DrawerFarmWriteFromProps) => {
  const { companyProfile }: { companyProfile: CompanyProfile } = useAuth();

  const createBranchMutation = useCreateBranch();
  const updateBranchMutation = useUpdateBranch(branch?.id);

  const initialValues = branch
    ? {
        name: branch.name,
        email: branch.email,
        phone: branch.phone,
        address: {
          street: branch.address.street,
          city: branch.address.city,
          stateOrProvince: branch.address.stateOrProvince,
          postalCode: branch.address.postalCode,
          country: branch.address.country,
          latitude: branch.address.latitude,
          longitude: branch.address.longitude,
        },
      }
    : {
        name: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          stateOrProvince: '',
          postalCode: '',
          country: '',
          latitude: 1,
          longitude: 1,
        },
      };

  const form = useForm<FormValues>({
    initialValues,

    validate: {
      email: (value) => (value ? emailValidator(value) : null),
    },
  });

  const handleResetAndClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (formValues: FormValues) => {
    if (branch) {
      const updatePayload = {
        name: formValues.name,
        email: formValues.email,
        phone: formValues.phone,
        address: formValues.address as Address,
      };
      updateBranchMutation.mutate(updatePayload, {
        onSuccess: (response) => {
          showSuccessNotification(
            'Branch update is success',
            `${response.data.name} has been updated.`,
          );
          handleResetAndClose();
        },
        onError: (error) => {
          showErrorNotification(
            'Branch update failed',
            error.response?.data.message || error.message,
          );
        },
      });
    } else {
      const createPayload = {
        ...formValues,
        address: formValues.address as Address,
        company: companyProfile.id,
      };
      createBranchMutation.mutate(createPayload, {
        onSuccess: () => {
          showSuccessNotification(
            'Branch creation is success',
            `${formValues.name} has been created.`,
          );
          handleResetAndClose();
        },
        onError: (error) => {
          showErrorNotification(
            'Branch creation failed',
            error.response?.data.message || error.message,
          );
        },
      });
    }
  };

  useShallowEffect(() => {
    if (branch) {
      form.setValues(branch);
    }
  }, [branch]);

  return (
    <Drawer
      opened={opened}
      onClose={handleResetAndClose}
      title={<Title order={3}>{title}</Title>}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing='xs'>
          <TextInput
            label='Branch name'
            required
            {...form.getInputProps('name')}
          />
          <TextInput label='Branch email' {...form.getInputProps('email')} />
          <TextInput label='Phone' {...form.getInputProps('phone')} required />
          <Group noWrap grow>
            <CountrySelect
              label='Country'
              required
              {...form.getInputProps('address.country')}
            />
            <TextInput
              label='City'
              required
              {...form.getInputProps('address.city')}
            />
          </Group>

          <Radio.Group
            label='Region Type'
            {...form.getInputProps('address.stateOrProvince')}
          >
            <Group mt='xs' spacing='xl'>
              <Radio value='state' label='State' />
              <Radio value='province' label='Province' />
            </Group>
          </Radio.Group>

          <TextInput
            label='Street'
            required
            {...form.getInputProps('address.street')}
          />
          <TextInput
            type='number'
            label='Postal code'
            required
            {...form.getInputProps('address.postalCode')}
          />

          <Group position='right' mt='xl'>
            <Button
              variant='subtle'
              disabled={
                createBranchMutation.isLoading || updateBranchMutation.isLoading
              }
              onClick={handleResetAndClose}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              loading={
                createBranchMutation.isLoading || updateBranchMutation.isLoading
              }
            >
              {branch ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};

export default DrawerBranchWriteFrom;
