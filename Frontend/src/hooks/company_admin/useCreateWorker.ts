// hooks/company/useCreateWorker.ts
import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, useQueryClient, UseMutationResult } from 'react-query';
import { useClient } from 'contexts/AuthContext';
import { UserProfile } from 'types/profileTypes';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface CreateCompanyAdminPayload {
  email: string;
  password: string;
  iin: string;
  name: string;
  surname: string;
  patronymic?: string;
}

export default function useCreateWorker(
  companyId: string | undefined,
): UseMutationResult<
  AxiosResponse<UserProfile>,
  AxiosError<{ message: string }>,
  CreateCompanyAdminPayload
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const createCompanyAdmin = (payload: CreateCompanyAdminPayload) => {
    return client.post('/auth/register/worker', {
      ...payload,
      company_id: companyId,
    });
  };

  return useMutation(createCompanyAdmin, {
    onSuccess: () => {
      showSuccessNotification('Администратор компании успешно добавлен');
      queryClient.invalidateQueries(['companyWithWorkers', companyId]); // Invalidate cache for company workers
    },
    onError: (error) => {
      showErrorNotification(
        'Ошибка при добавлении администратора компании',
        error.response?.data.message ||
          'Не удалось добавить администратора компании',
      );
    },
  });
}
