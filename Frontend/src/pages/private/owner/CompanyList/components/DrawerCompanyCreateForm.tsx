import { Button, Drawer, Stack, TextInput } from '@mantine/core';
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
      name: '',
      address: '',
      iin: '',
      bin: '',
      head_name: '',
      head_surname: '',
      head_patronymic: '',
    },

    validate: {
      name: (value) =>
        value.trim().length > 0
          ? null
          : 'Пожалуйста, введите название компании',
      address: (value) =>
        value.trim().length > 0 ? null : 'Пожалуйста, введите адрес компании',
      head_name: (value) =>
        value.trim().length > 0 ? null : 'Пожалуйста, введите имя руководителя',
      head_surname: (value) =>
        value.trim().length > 0
          ? null
          : 'Пожалуйста, введите фамилию руководителя',
      iin: (value) =>
        value && value.length === 12
          ? null
          : 'ИИН должен содержать ровно 12 цифр',
      bin: (value) =>
        value && value.length === 12
          ? null
          : 'БИН должен содержать ровно 12 цифр',
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
          error.response?.data.error || error.message,
        );
      },
    });
  };

  return (
    <Drawer opened={opened} onClose={onClose} title={title} padding='xl'>
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack spacing='sm'>
          <TextInput
            label='Название компании'
            placeholder='Введите название компании'
            required
            {...form.getInputProps('name')}
          />
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
          <TextInput
            label='Имя руководителя'
            placeholder='Введите имя руководителя'
            required
            {...form.getInputProps('head_name')}
          />
          <TextInput
            label='Фамилия руководителя'
            placeholder='Введите фамилию руководителя'
            required
            {...form.getInputProps('head_surname')}
          />
          <TextInput
            label='Отчество руководителя'
            placeholder='Введите отчество руководителя (если есть)'
            {...form.getInputProps('head_patronymic')}
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
