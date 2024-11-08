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
import { useShallowEffect } from '@mantine/hooks';
import { useAuth } from 'contexts/AuthContext';
import useUpdateCompany from 'hooks/company/useUpdateCompany';
import { CompanyProfile } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface FormValues {
  name: string;
  email: string | null;
  phone: string;
}

interface ModalCompanyUpdateFromProps
  extends Pick<ModalProps, 'opened' | 'onClose'> {
  title: string;
}

const ModalCompanyUpdateFrom = ({
  opened,
  onClose,
  title,
}: ModalCompanyUpdateFromProps) => {
  const { companyProfile }: { companyProfile: CompanyProfile } = useAuth();

  const updateCompanyMutation = useUpdateCompany(companyProfile.id);

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      email: '',
      phone: ''
    },
  });

  const handleResetAndClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (formValues: FormValues) => {
    updateCompanyMutation.mutate(formValues, {
      onSuccess: (response) => {
        showSuccessNotification(
          'Company update is success',
          `${response.data.name} has been updated.`,
        );
        handleResetAndClose();
      },
      onError: (error) => {
        showErrorNotification(
          'Company update failed',
          error.response?.data.detail || error.message,
        );
      },
    });
  };

  useShallowEffect(() => {
    if (companyProfile) {
      form.setFieldValue('name', companyProfile.name);
      form.setFieldValue('email', companyProfile.email);
    }
  }, [companyProfile]);

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
            label='Company name'
            required
            {...form.getInputProps('name')}
          />
          <TextInput label='Company email' {...form.getInputProps('email')} />

          <Group position='right' mt='xl'>
            <Button
              variant='subtle'
              onClick={handleResetAndClose}
              disabled={updateCompanyMutation.isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' loading={updateCompanyMutation.isLoading}>
              Update
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default ModalCompanyUpdateFrom;
