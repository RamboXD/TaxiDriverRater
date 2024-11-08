import {
  Button,
  Drawer,
  Stack,
  TextInput,
  Checkbox,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import useCreateDriver from 'hooks/drivers/useCreateDriver';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface DrawerDriverCreateFormProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}

const DrawerDriverCreateForm = ({
  opened,
  onClose,
  title,
}: DrawerDriverCreateFormProps) => {
  const createDriverMutation = useCreateDriver();

  const form = useForm({
    initialValues: {
      iin: '',
      name: '',
      surname: '',
      patronymic: '',
      category: '',
      penalty: false,
      insurance_data: '',
      insurance_number: '',
      address: '',
      phone_number: '',
    },

    validate: {
      iin: (value) =>
        value.length === 12 ? null : 'ИИН должен содержать 12 цифр',
      name: (value) => (value.trim().length > 0 ? null : 'Введите имя'),
      surname: (value) => (value.trim().length > 0 ? null : 'Введите фамилию'),
      category: (value) => (value ? null : 'Выберите категорию'),
      insurance_data: (value) =>
        value.trim().length > 0 ? null : 'Введите данные страховки',
      phone_number: (value) =>
        value.length >= 10 ? null : 'Введите действительный номер телефона',
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    createDriverMutation.mutate(values, {
      onSuccess: () => {
        showSuccessNotification('Водитель успешно создан');
        form.reset();
        onClose();
      },
      onError: () => {
        showErrorNotification('Не удалось создать водителя');
      },
    });
  };

  return (
    <Drawer opened={opened} onClose={onClose} title={title} padding='xl'>
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
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
            placeholder='Введите отчество (если есть)'
            {...form.getInputProps('patronymic')}
          />
          <Select
            label='Категория'
            placeholder='Выберите категорию'
            required
            data={[
              { value: 'A', label: 'A' },
              { value: 'B', label: 'B' },
              { value: 'C', label: 'C' },
              { value: 'D', label: 'D' },
              { value: 'E', label: 'E' },
            ]}
            {...form.getInputProps('category')}
          />
          <Checkbox
            label='Наличие штрафа'
            {...form.getInputProps('penalty', { type: 'checkbox' })}
          />
          <TextInput
            label='Данные страховки'
            placeholder='Введите данные страховки'
            {...form.getInputProps('insurance_data')}
          />
          <TextInput
            label='Номер страховки'
            placeholder='Введите номер страховки'
            {...form.getInputProps('insurance_number')}
          />
          <TextInput
            label='Адрес'
            placeholder='Введите адрес'
            {...form.getInputProps('address')}
          />
          <TextInput
            label='Телефон'
            placeholder='Введите телефон'
            {...form.getInputProps('phone_number')}
          />
          <Button type='submit' fullWidth mt='md'>
            Создать водителя
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};

export default DrawerDriverCreateForm;
