// components/DrawerWorkerCreateForm.tsx
import { Button, Drawer, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import useCreateCompanyAdmin from 'hooks/company_admin/useCreateCompanyAdmin';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface DrawerWorkerCreateFormProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  companyId: string | undefined;
}

const DrawerWorkerCreateForm = ({
  opened,
  onClose,
  title,
  companyId,
}: DrawerWorkerCreateFormProps) => {
  const createWorkerMutation = useCreateCompanyAdmin(companyId);

  const form = useForm({
    initialValues: {
      name: '',
      iin: '',
      surname: '',
      patronymic: '',
      email: '',
      password: '',
    },

    validate: {
      name: (value) => (value ? null : 'Имя обязательно'),
      surname: (value) => (value ? null : 'Фамилия обязательна'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Неверный email'),
      iin: (value) =>
        value.length === 12 ? null : 'ИИН должен содержать 12 цифр',
      password: (value) =>
        value.length >= 1 ? null : 'Пароль должен содержать минимум 8 символов',
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    createWorkerMutation.mutate(values, {
      onSuccess: () => {
        showSuccessNotification('Сотрудник успешно добавлен');
        form.reset();
        onClose();
      },
      onError: (error) => {
        showErrorNotification(
          'Не удалось добавить сотрудника',
          error.response?.data.message || error.message,
        );
      },
    });
  };

  return (
    <Drawer opened={opened} onClose={onClose} title={title} padding='xl'>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing='sm'>
          <TextInput
            label='ИИН'
            placeholder='Введите ИИН'
            required
            {...form.getInputProps('iin')}
          />
          <TextInput
            label='Имя'
            placeholder='Введите имя'
            required
            {...form.getInputProps('name')}
          />
          <TextInput
            label='Фамилия'
            placeholder='Введите фамилию'
            required
            {...form.getInputProps('surname')}
          />
          <TextInput
            label='Отчество'
            placeholder='Введите отчество'
            {...form.getInputProps('patronymic')}
          />
          <TextInput
            label='Email'
            placeholder='Введите email'
            required
            {...form.getInputProps('email')}
          />
          <TextInput
            label='Пароль'
            placeholder='Введите пароль'
            type='password'
            required
            {...form.getInputProps('password')}
          />
          <Button type='submit' fullWidth mt='md'>
            Добавить сотрудника
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};

export default DrawerWorkerCreateForm;
