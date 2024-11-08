import { useMutation, UseMutationResult } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface CreateDriverPayload {
  iin: string;
  name: string;
  surname: string;
  patronymic?: string;
  category: string;
  penalty: boolean;
  insurance_data: string;
  insurance_number: string;
  address: string;
  phone_number: string;
}

interface CreateDriverResponse {
  message: string;
}

export default function useCreateDriver(): UseMutationResult<
  AxiosResponse<CreateDriverResponse>,
  AxiosError,
  CreateDriverPayload
> {
  const client = useClient();

  const createDriver = (payload: CreateDriverPayload) => {
    return client.post('/auth/register/driver', payload);
  };

  return useMutation(createDriver, {
    onSuccess: (response) => {
      showSuccessNotification(
        response.data.message || 'Водитель успешно создан',
      );
    },
    onError: (error) => {
      showErrorNotification(
        'Ошибка создания водителя',
        error.message || 'Не удалось создать водителя',
      );
    },
  });
}
