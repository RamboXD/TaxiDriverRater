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
import { useAuth } from 'contexts/AuthContext';
import useUpdateOwner from 'hooks/owner/useUpdateOwner';
import { OwnerProfile } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface FormValues {
  firstName: string;
  lastName: string;
}

interface ModalAccountFromProps extends Pick<ModalProps, 'opened' | 'onClose'> {
  title: string;
}

const ModalProfileUpdateFrom = ({
  opened,
  onClose,
  title,
}: ModalAccountFromProps) => {
  const { ownerProfile }: { ownerProfile: OwnerProfile } = useAuth();

  const updateOwnerMutation = useUpdateOwner(ownerProfile.id);

  const form = useForm<FormValues>({
    initialValues: {
      firstName: ownerProfile.firstName,
      lastName: ownerProfile.lastName,
    },
  });

  const handleResetAndClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (formValues: FormValues) => {
    updateOwnerMutation.mutate(formValues, {
      onSuccess: (response) => {
        showSuccessNotification(
          'Owner update is success',
          `${response.data.firstName} has been updated.`,
        );
        handleResetAndClose();
      },
      onError: (error) => {
        showErrorNotification(
          'Owner update failed',
          error.response?.data.message || error.message,
        );
      },
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={handleResetAndClose}
      title={<Title order={3}>{title}</Title>}
      centered
      keepMounted={false}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing='xs'>
          <TextInput
            label='First name'
            required
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label='Last name'
            required
            {...form.getInputProps('lastName')}
          />

          <Group position='right' mt='xl'>
            <Button
              variant='subtle'
              onClick={handleResetAndClose}
              disabled={updateOwnerMutation.isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' loading={updateOwnerMutation.isLoading}>
              Update
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default ModalProfileUpdateFrom;
