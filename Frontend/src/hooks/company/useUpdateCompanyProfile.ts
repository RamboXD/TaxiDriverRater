import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { CompanyProfile } from 'types/profileTypes';
import {
  showSuccessNotification,
  showErrorNotification,
} from 'utils/notifications';

export type CompanyProfileUpdatePayload = {
  //   companyName: string;
  address: string;
  headName: string;
  headSurname: string;
  headPatronymic?: string;
};

export default function useUpdateCompanyProfile(
  companyID: string,
): UseMutationResult<
  AxiosResponse<CompanyProfile>,
  AxiosError<{ message: string }>,
  CompanyProfileUpdatePayload
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const updateCompanyProfile = (payload: CompanyProfileUpdatePayload) => {
    return client.put(`/auth/companies/${companyID}`, payload);
  };

  return useMutation(updateCompanyProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries(['companyProfile', companyID]);
      showSuccessNotification('Данные компании успешно обновлены');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      showErrorNotification(
        'Ошибка при обновлении данных компании',
        error.response?.data.message || error.message,
      );
    },
  });
}
