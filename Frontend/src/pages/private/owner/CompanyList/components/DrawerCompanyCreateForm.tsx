import { Button, Drawer, Stack, TextInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import useCreateCompany from 'hooks/company/useCreateCompany';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface DrawerCompanyCreateFormProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}

const DrawerCompanyCreateForm = ({
  opened,
  onClose,
  title,
}: DrawerCompanyCreateFormProps) => {
  const createCompanyMutation = useCreateCompany();

  const form = useForm({
    initialValues: {
      //   companyName: '',
      address: '',
      iin: '',
      bin: '',
    },

    validate: {
      //   companyName: (value) =>
      //     value.trim().length > 0 ? null : 'Название компании обязательно',
      address: (value) =>
        value.trim().length > 0 ? null : 'Адрес компании обязателен',
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    createCompanyMutation.mutate(values, {
      onSuccess: () => {
        showSuccessNotification('Компания успешно создана');
        form.reset();
        onClose();
      },
      onError: (error) => {
        showErrorNotification(
          'Не удалось создать компанию',
          error.response?.data.message || error.message,
        );
      },
    });
  };

  return (
    <Drawer opened={opened} onClose={onClose} title={title} padding='xl'>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing='sm'>
          {/* <TextInput
            label='Название компании'
            placeholder='Введите название'
            required
            {...form.getInputProps('companyName')}
          /> */}
          <TextInput
            label='Адрес'
            placeholder='Введите адрес'
            required
            {...form.getInputProps('address')}
          />
          <TextInput
            label='ИИН'
            placeholder='Введите ИИН'
            {...form.getInputProps('iin')}
          />
          <TextInput
            label='БИН'
            placeholder='Введите БИН'
            {...form.getInputProps('bin')}
          />
          <Button type='submit' fullWidth mt='md'>
            Создать компанию
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};

export default DrawerCompanyCreateForm;
