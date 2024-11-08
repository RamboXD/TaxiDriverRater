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
import { CompanyProfile } from 'types/profileTypes';
import { showSuccessNotification } from 'utils/notifications';

interface FormValues {
  companyName: string;
  address: string;
  headName: string;
  headSurname: string;
  headPatronymic?: string;
}

interface DrawerCompanyEditFormProps
  extends Pick<DrawerProps, 'opened' | 'onClose'> {
  company: CompanyProfile;
  onSubmit: (values: FormValues) => void;
}

const DrawerCompanyEditForm = ({
  company,
  opened,
  onClose,
  onSubmit,
}: DrawerCompanyEditFormProps) => {
  const form = useForm<FormValues>({
    initialValues: {
      companyName: company.Name,
      address: company.Address,
      headName: company.HeadName,
      headSurname: company.HeadSurname,
      headPatronymic: company.HeadPatronymic || '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    showSuccessNotification('Данные компании успешно обновлены');
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={<Text size='xl'>Редактировать данные компании</Text>}
      padding='lg'
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing='sm'>
          <TextInput
            label='Название компании'
            placeholder='Введите название компании'
            {...form.getInputProps('companyName')}
            required
          />
          <TextInput
            label='Адрес'
            placeholder='Введите адрес компании'
            {...form.getInputProps('address')}
            required
          />
          <TextInput
            label='Имя главы'
            placeholder='Введите имя главы компании'
            {...form.getInputProps('headName')}
            required
          />
          <TextInput
            label='Фамилия главы'
            placeholder='Введите фамилию главы компании'
            {...form.getInputProps('headSurname')}
            required
          />
          <TextInput
            label='Отчество главы'
            placeholder='Введите отчество главы компании'
            {...form.getInputProps('headPatronymic')}
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

export default DrawerCompanyEditForm;
