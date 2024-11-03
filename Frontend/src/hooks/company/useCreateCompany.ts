import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, useQueryClient, UseMutationResult } from 'react-query';
import { CompanyProfile } from 'types/profileTypes';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface CreateCompanyPayload {
  // companyName: string;
  address: string;
  iin: string;
  bin: string;
}

export default function useCreateCompany(): UseMutationResult<
  AxiosResponse<CompanyProfile>,
  AxiosError<{ message: string }>,
  CreateCompanyPayload
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const createCompany = (payload: CreateCompanyPayload) => {
    return client.post('/companies', payload);
  };

  return useMutation(createCompany, {
    onSuccess: () => {
      showSuccessNotification('Компания успешно создана');
      queryClient.invalidateQueries('companies'); // Invalidate the cache for companies list
    },
    onError: (error) => {
      showErrorNotification(
        'Ошибка создания компании',
        error.response?.data.message || 'Не удалось создать компанию',
      );
    },
  });
}
