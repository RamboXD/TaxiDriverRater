import {
  Button,
  Drawer,
  DrawerProps,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { UserProfile } from 'types/profileTypes';
import { showSuccessNotification } from 'utils/notifications';

interface FormValues {
  name: string;
  surname: string;
  patronymic?: string;
  iin: string;
}

interface DrawerUserEditFormProps
  extends Pick<DrawerProps, 'opened' | 'onClose'> {
  profile: UserProfile;
  onSubmit: (values: FormValues) => void;
}

const DrawerUserEditForm = ({
  profile,
  opened,
  onClose,
  onSubmit,
}: DrawerUserEditFormProps) => {
  const form = useForm<FormValues>({
    initialValues: {
      name: profile.user.name,
      surname: profile.user.surname,
      patronymic: profile.user.patronymic || '',
      iin: profile.user.iin,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    showSuccessNotification('Данные пользователя успешно обновлены');
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={<Text size='xl'>Редактировать данные пользователя</Text>}
      padding='lg'
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing='sm'>
          <TextInput
            label='Имя'
            placeholder='Введите имя'
            {...form.getInputProps('name')}
            required
          />
          <TextInput
            label='Фамилия'
            placeholder='Введите фамилию'
            {...form.getInputProps('surname')}
            required
          />
          <TextInput
            label='Отчество'
            placeholder='Введите отчество'
            {...form.getInputProps('patronymic')}
          />
          <TextInput
            label='ИИН'
            placeholder='Введите ИИН'
            {...form.getInputProps('iin')}
            required
          />
        </Stack>

        <Group position='right' mt='lg'>
          <Button variant='subtle' onClick={onClose}>
            Отмена
          </Button>
          <Button type='submit'>Сохранить</Button>
        </Group>
      </form>
    </Drawer>
  );
};

export default DrawerUserEditForm;
