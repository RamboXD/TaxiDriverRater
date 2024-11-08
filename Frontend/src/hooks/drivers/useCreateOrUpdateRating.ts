import { useMutation, UseMutationResult } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface RatingPayload {
  driverId: string | undefined;
  rating: number;
  description: string;
}

export default function useCreateOrUpdateRating(): UseMutationResult<
  AxiosResponse,
  AxiosError,
  RatingPayload
> {
  const client = useClient();

  const submitRating = ({ driverId, rating, description }: RatingPayload) =>
    client.post(`/auth/rate/driver`, {
      driver_id: driverId,
      rating,
      description,
    });

  return useMutation(submitRating, {
    onSuccess: () => {
      showSuccessNotification('Рейтинг успешно сохранен');
    },
    onError: () => {
      showErrorNotification('Ошибка при сохранении рейтинга');
    },
  });
}
