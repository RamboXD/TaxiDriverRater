import {
  Button,
  Group,
  Modal,
  ModalProps,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import useUpdateFarmer from 'hooks/farmer/useUpdateFarmer';
import { GmOwner } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface FormValues {
  firstName: string;
  lastName: string;
}

interface EditGeneralModalProps extends Pick<ModalProps, 'opened' | 'onClose'> {
  farmerProfile: GmOwner;
}

const EditGeneralModal = ({
  farmerProfile,
  opened,
  onClose,
}: EditGeneralModalProps) => {
  const updateProfile = useUpdateFarmer(farmerProfile.id);

  const form = useForm<FormValues>({
    initialValues: {
      firstName: farmerProfile.firstName,
      lastName: farmerProfile.lastName,
    },
  });

  const handleResetAndClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (formValues: FormValues) => {
    updateProfile.mutate(formValues, {
      onSuccess: () => {
        showSuccessNotification('Profile update success');
        handleResetAndClose();
      },
      onError: (error) => {
        showErrorNotification(error.response?.data.message || error.message);
      },
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={handleResetAndClose}
      centered
      title={<Title order={3}>Edit General</Title>}
      keepMounted={false}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing='xs'>
          <TextInput
            label='First Name'
            placeholder='John'
            required
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label='Last Name'
            placeholder='Doe'
            required
            {...form.getInputProps('lastName')}
          />

          <Group position='right' mt='xl'>
            <Button
              variant='default'
              onClick={handleResetAndClose}
              disabled={updateProfile.isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' loading={updateProfile.isLoading}>
              Update
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default EditGeneralModal;
