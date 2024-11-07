import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, useQueryClient, UseMutationResult } from 'react-query';
import { CompanyProfile } from 'types/profileTypes';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface CreateCompanyPayload {
  name: string;
  address: string;
  iin: string;
  bin: string;
  head_name: string;
  head_surname: string;
  head_patronymic?: string; // Optional field
}

export default function useCreateCompany(): UseMutationResult<
  AxiosResponse<CompanyProfile>,
  AxiosError<{ error: string }>,
  CreateCompanyPayload
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const createCompany = (payload: CreateCompanyPayload) => {
    return client.post('/auth/register/company', payload);
  };

  return useMutation(createCompany, {
    onSuccess: () => {
      showSuccessNotification('Компания успешно создана');
      queryClient.invalidateQueries('auth/register/company'); // Invalidate the cache for companies list
    },
    onError: (error) => {
      showErrorNotification(
        'Ошибка создания компании',
        error.response?.data.error || 'Не удалось создать компанию',
      );
    },
  });
}
