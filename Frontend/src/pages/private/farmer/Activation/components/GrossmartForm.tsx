import {
  Button,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';

import { useAuth } from 'contexts/AuthContext';
import useCreateFarmer from 'hooks/farmer/useCreateFarmer';
import { AddressCreate, GmOwnerProfile } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface FormValues {
  name: string;
  address: string;
  city: string;
  country: string;
  stateOrProvince: string;
  postalCode: string;
}

const GrossmartForm = (): JSX.Element => {

  const {
    farmerProfile,
  }: { farmerProfile: GmOwnerProfile; logout: () => void } = useAuth();
  console.log(farmerProfile)
  const updateProfile = useCreateFarmer();

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      address: '',
      city: '',
      country: '',
      stateOrProvince: '',
      postalCode: ''
    },
  });

  const handleSubmit = (formValues: FormValues) => {
    const payload = {
      name: formValues.name,
      address: {
        street: formValues.address,
        city: formValues.city,
        country: formValues.country,
        latitude: 0,
        longitude: 0,
        postalCode: formValues.postalCode,
        stateOrProvince: formValues.stateOrProvince,
      } as AddressCreate,
    };

    updateProfile.mutate(payload, {
      onSuccess: () => {
        showSuccessNotification('Wholesale created.');
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
              Name
            </Text>
          }
          placeholder='Wholesaler'
          required
          {...form.getInputProps('name')}
        />
        <TextInput
          label={
            <Text weight={700} mb='xs' span>
              Country
            </Text>
          }
          placeholder='Antonio Sandoval'
          required
          {...form.getInputProps('country')}
        />
        <TextInput
          label={
            <Text weight={700} mb='xs' span>
              City
            </Text>
          }
          placeholder='Antonio Sandoval'
          required
          {...form.getInputProps('city')}
        />
        <TextInput
          label={
            <Text weight={700} mb='xs' span>
              Address
            </Text>
          }
          placeholder='Antonio Sandoval'
          required
          {...form.getInputProps('address')}
        />
        <TextInput
          label={
            <Text weight={700} mb='xs' span>
              State Or Province
            </Text>
          }
          placeholder='Antonio Sandoval'
          required
          {...form.getInputProps('stateOrProvince')}
        />
        <TextInput
          label={
            <Text weight={700} mb='xs' span>
              Postal Code
            </Text>
          }
          placeholder='Antonio Sandoval'
          required
          {...form.getInputProps('postalCode')}
        />
        <Button fullWidth type='submit' loading={updateProfile.isLoading}>
          Sign Up
        </Button>

      </Stack>
    </form>
  );
};

export default GrossmartForm;
