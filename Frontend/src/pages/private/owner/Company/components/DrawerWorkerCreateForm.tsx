// components/DrawerWorkerCreateForm.tsx
import { Button, Drawer, Stack, TextInput, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import useCreateCompanyAdmin from 'hooks/company_admin/useCreateCompanyAdmin';
import { useParams } from 'react-router-dom';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';
import { UserProfile } from 'types/profileTypes';
import { useAuth } from 'contexts/AuthContext';

interface DrawerWorkerCreateFormProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}

const DrawerWorkerCreateForm = ({
  opened,
  onClose,
  title,
}: DrawerWorkerCreateFormProps) => {
  const { profile }: { profile: UserProfile; logout: () => void } = useAuth();
  const createWorkerMutation = useCreateCompanyAdmin(profile.company?.ID);

  const form = useForm({
    initialValues: {
      name: '',
      iin: '',
      surname: '',
      patronymic: '',
      email: '',
      role: '',
      password: '',
    },

    validate: {
      name: (value) => (value ? null : 'Имя обязательно'),
      surname: (value) => (value ? null : 'Фамилия обязательна'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Неверный email'),
      role: (value) => (value ? null : 'Роль обязательна'),
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
          <Select
            label='Роль'
            placeholder='Выберите роль'
            data={[
              { value: 'worker', label: 'Сотрудник' },
              { value: 'manager', label: 'Менеджер' },
              { value: 'admin', label: 'Администратор' },
            ]}
            required
            {...form.getInputProps('role')}
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
