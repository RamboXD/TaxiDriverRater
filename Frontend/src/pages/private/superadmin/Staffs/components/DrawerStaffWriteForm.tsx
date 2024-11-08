import {
  Button,
  Drawer,
  DrawerProps,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useShallowEffect } from '@mantine/hooks';
import { useAuth } from 'contexts/AuthContext';
import useCreateStaff from 'hooks/staff/useCreateStaff';
import useUpdateStaff from 'hooks/staff/useUpdateStaff';
import { Staff, UserRegistration } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';
import {
  emailValidator,
  passwordValidator,
  rePasswordValidator,
} from 'utils/validations';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword: string;
}

interface DrawerFarmWriteFromProps
  extends Pick<DrawerProps, 'opened' | 'onClose'> {
  staff?: Staff;
  title: string;
}

const DrawerStaffWriteForm = ({
  staff,
  opened,
  onClose,
  title,
}: DrawerFarmWriteFromProps) => {
  const { companyProfile } = useAuth();

  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff(staff?.id);

  const form = useForm<FormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      rePassword: '',
    },

    validate: {
      email: (value) => emailValidator(value),
      password: (value) => (staff ? null : passwordValidator(value)),
      rePassword: (value, values) =>
        staff ? null : rePasswordValidator(values.password)(value),
    },
  });

  const isMutationLoading =
    createMutation.isLoading || updateMutation.isLoading;

  const handleResetAndClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (formValues: FormValues) => {
    if (staff) {
      const updatePayload = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        activated: true,
      };

      updateMutation.mutate(updatePayload, {
        onSuccess: (response) => {
          showSuccessNotification(
            'Employee update is success',
            `${response.data.firstName} has been updated.`,
          );
          handleResetAndClose();
        },
        onError: (error) => {
          showErrorNotification(
            'Employee update failed',
            error.response?.data.detail || error.message,
          );
        },
      });
    } else {
      const createPayload = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        company: companyProfile.id,
        user: {
          email: formValues.email,
          password: formValues.password,
          role: 'staff' as UserRegistration['role'],
        },
      };

      createMutation.mutate(createPayload, {
        onSuccess: () => {
          showSuccessNotification('Staff created successfully');
          handleResetAndClose();
        },
        onError: (error) => {
          showErrorNotification(
            'Staff create failed',
            error.response?.data.detail || error.message,
          );
        },
      });
    }
  };

  useShallowEffect(() => {
    if (staff) {
      form.setFieldValue('firstName', staff.firstName);
      form.setFieldValue('lastName', staff.lastName);
      form.setFieldValue('email', staff.email);
    }
  }, [staff?.firstName, staff?.lastName, staff?.email]);

  return (
    <Drawer
      opened={opened}
      onClose={handleResetAndClose}
      title={<Title order={3}>{title}</Title>}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing='xs'>
          <Group noWrap grow>
            <TextInput
              label='First Name'
              readOnly={isMutationLoading}
              required
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label='Last Name'
              readOnly={isMutationLoading}
              required
              {...form.getInputProps('lastName')}
            />
          </Group>

          <TextInput
            label='Email'
            readOnly={!!staff || isMutationLoading}
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            placeholder='Enter password'
            label='Password'
            disabled={!!staff}
            required={!staff}
            {...form.getInputProps('password')}
          />

          <PasswordInput
            placeholder='Repeat password'
            label='Password Repeat'
            disabled={!!staff}
            required={!staff}
            {...form.getInputProps('rePassword')}
          />

          <Group position='right' mt='xl'>
            <Button
              onClick={handleResetAndClose}
              disabled={isMutationLoading}
              variant='subtle'
            >
              Cancel
            </Button>
            <Button type='submit' loading={isMutationLoading}>
              {staff ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};

export default DrawerStaffWriteForm;
