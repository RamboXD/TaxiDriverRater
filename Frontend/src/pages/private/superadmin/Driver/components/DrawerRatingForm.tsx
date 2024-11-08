import {
  Button,
  Drawer,
  Stack,
  Textarea,
  TextInput,
  NumberInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import useCreateOrUpdateRating from 'hooks/drivers/useCreateOrUpdateRating';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface DrawerRatingFormProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  driverId: string | undefined;
  isEditing: boolean;
  initialRating?: { Rating: number; Description: string } | null;
}

const DrawerRatingForm = ({
  opened,
  onClose,
  title,
  driverId,
  isEditing,
  initialRating,
}: DrawerRatingFormProps) => {
  const ratingMutation = useCreateOrUpdateRating();

  const form = useForm({
    initialValues: {
      rating: initialRating?.Rating || 1,
      description: initialRating?.Description || '',
    },

    validate: {
      rating: (value) =>
        value >= 1 && value <= 5 ? null : 'Рейтинг должен быть от 1 до 5',
      description: (value) =>
        value.trim().length > 0 ? null : 'Введите комментарий',
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    ratingMutation.mutate(
      { driverId, rating: values.rating, description: values.description },
      {
        onSuccess: () => {
          showSuccessNotification(
            isEditing ? 'Отзыв обновлен' : 'Отзыв добавлен',
          );
          form.reset();
          onClose();
        },
        onError: () => {
          showErrorNotification('Ошибка при отправке отзыва');
        },
      },
    );
  };

  return (
    <Drawer opened={opened} onClose={onClose} title={title} padding='xl'>
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack spacing='sm'>
          <NumberInput
            label='Рейтинг'
            placeholder='Оценка от 1 до 5'
            required
            min={1}
            max={5}
            {...form.getInputProps('rating')}
          />
          <Textarea
            label='Комментарий'
            placeholder='Введите комментарий'
            required
            {...form.getInputProps('description')}
          />
          <Button type='submit' fullWidth mt='md'>
            {isEditing ? 'Обновить отзыв' : 'Добавить отзыв'}
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};

export default DrawerRatingForm;
