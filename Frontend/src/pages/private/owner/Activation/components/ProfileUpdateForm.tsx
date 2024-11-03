import { Button, Stack, Text, TextInput } from '@mantine/core';
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
const ProfileUpdateForm = (): JSX.Element => {
  const { ownerProfile }: { ownerProfile: OwnerProfile } = useAuth();

  const updateMutation = useUpdateOwner(ownerProfile.id);

  const form = useForm<FormValues>({
    initialValues: {
      firstName: ownerProfile.firstName,
      lastName: ownerProfile.lastName,
    },
  });

  const handleSubmit = (formValues: FormValues) => {
    updateMutation.mutate(formValues, {
      onSuccess: () => {
        showSuccessNotification('Profile update success');
      },
      onError: (error) => {
        showErrorNotification(
          'Profile update failed',
          error.response?.data.message || error.message,
        );
      },
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label={
            <Text weight={700} span>
              Owner’s first name
            </Text>
          }
          placeholder='John'
          readOnly={updateMutation.isLoading}
          required
          {...form.getInputProps('firstName')}
        />
        <TextInput
          label={
            <Text weight={700} span>
              Owner’s last name
            </Text>
          }
          placeholder='Doe'
          readOnly={updateMutation.isLoading}
          required
          {...form.getInputProps('lastName')}
        />

        <Button
          mt='md'
          type='submit'
          loading={updateMutation.isLoading}
          fullWidth
        >
          Activate
        </Button>
      </Stack>
    </form>
  );
};
export default ProfileUpdateForm;
