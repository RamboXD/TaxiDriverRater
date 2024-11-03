import {
  Button,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from 'contexts/AuthContext';
import useUpdateFarmer from 'hooks/farmer/useUpdateFarmer';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

import { GmOwnerProfile } from 'types/generated';

interface FormValues {
  firstName: string;
  lastName: string;
}

const ProfileUpdateForm = ({
  handleStepAhead,
}: {
  handleStepAhead: () => void;
}): JSX.Element => {

  const {
    farmerProfile,
  }: { farmerProfile: GmOwnerProfile; logout: () => void } = useAuth();
  const updateProfile = useUpdateFarmer(farmerProfile.id);

  const form = useForm<FormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
    },
  });

  const handleSubmit = (formValues: FormValues) => {
    const payload = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
    };

    updateProfile.mutate(payload, {
      onSuccess: () => {
        showSuccessNotification('Profile Updated.');
        handleStepAhead()
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
            <Text weight={700} mb='xs' span>
              First name
            </Text>
          }
          placeholder='John'
          required
          {...form.getInputProps('firstName')}
        />
        <TextInput
          label={
            <Text weight={700} mb='xs' span>
              Last name
            </Text>
          }
          placeholder='Doe'
          required
          {...form.getInputProps('lastName')}
        />

        <Button fullWidth type="submit" loading={updateProfile.isLoading}>
          Continue
        </Button>

      </Stack>
    </form>
  );
};

export default ProfileUpdateForm;
