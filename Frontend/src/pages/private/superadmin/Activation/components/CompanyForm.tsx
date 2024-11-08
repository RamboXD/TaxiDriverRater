import { Button, Input, LoadingOverlay, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useShallowEffect } from '@mantine/hooks';
import { useAuth } from 'contexts/AuthContext';
import useCreateCompany from 'hooks/company/useCreateCompany';
import useUpdateCompany from 'hooks/company/useUpdateCompany';
import InputMask from 'react-input-mask';
import { CompanyProfile } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';
import { emailValidator } from 'utils/validations';

interface FormValues {
  email: string;
  name: string;
  phone: string;
}

const CompanyForm = ({
  handleStepAhead,
}: {
  handleStepAhead: () => void;
}): JSX.Element => {
  const {
    companyProfile,
    isCompanyProfileLoading,
  }: {
    companyProfile: CompanyProfile | undefined;
    isCompanyProfileLoading: boolean;
  } = useAuth();

  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany(companyProfile?.id);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: ''
    },
    validate: {
      email: (value) => emailValidator(value),
      phone: (value) =>
        value.replace(/[()_\- ]/g, '').length === 12 &&
        value !== '+____ ___-____'
          ? null
          : 'Fill in full phone number',
    },

    transformValues: (values) => ({
      ...values,
      phone:
        values.phone.length > 0 && values.phone !== '+____ ___-____'
          ? values.phone.replace(/[()\- ]/g, '')
          : values.phone,
    }),
  });

  useShallowEffect(() => {
    if (companyProfile) {

      form.setFieldValue('name', companyProfile.name);
      form.setFieldValue('email', companyProfile?.email || '');
      form.setFieldValue('phone', companyProfile?.phone || '');
    }
  }, [companyProfile?.name, companyProfile?.email]);

  const handleSubmit = (formValues: FormValues) => {
    if (companyProfile) {
      updateMutation.mutate(formValues, {
        onSuccess: () => {
          showSuccessNotification('Company update success');
          handleStepAhead();
        },
        onError: (error) => {
          showErrorNotification(
            'Company create failed',
            error.response?.data.detail || error.message,
          );
        },
      });
    } else {
      createMutation.mutate(formValues, {
        onSuccess: () => {
          showSuccessNotification('Company create success');
          handleStepAhead();
        },
        onError: (error) => {
          showErrorNotification(
            'Company create failed',
            error.response?.data.message || error.message,
          );
        },
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <LoadingOverlay visible={isCompanyProfileLoading} />

        <TextInput
          label={
            <Text weight={700} span>
              Name
            </Text>
          }
          placeholder='Company name'
          readOnly={createMutation.isLoading}
          required
          {...form.getInputProps('name')}
        />
        <TextInput

          label={
            <Text weight={700} span>
              Email
            </Text>
          }
          placeholder='example@mail.com'
          readOnly={createMutation.isLoading}
          required
          {...form.getInputProps('email')}
        />
        <Input.Wrapper error={form.errors.phone}>
          <Input.Label>
            <Text size='sm' align='center' weight={600}>
              Phone number
            </Text>
          </Input.Label>
          <Input
            component={InputMask}
            mask='+9999 999-9999'
            placeholder='Enter your phone number'
            {...form.getInputProps('phone')}
          />
        </Input.Wrapper>
        <Button
          mt='md'
          fullWidth
          type='submit'
          loading={createMutation.isLoading || updateMutation.isLoading}
        >
          {companyProfile ? 'Update Company' : 'Create Company'}
        </Button>
      </Stack>
    </form>
  );
};
export default CompanyForm;
