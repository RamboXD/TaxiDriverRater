import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { Company, CompanyUpdate } from 'types/generated';

export default function useUpdateCompany(
  companyId?: string,
): UseMutationResult<
  AxiosResponse<Company>,
  AxiosError<{ detail: string }>,
  CompanyUpdate
> {
  const queryClient = useQueryClient();
  const client = useClient();

  const updateCompany = (payload: CompanyUpdate) => {
    return client.put(`companies/${companyId}/`, payload);
  };

  return useMutation(updateCompany, {
    onSuccess: () => {
      queryClient.invalidateQueries(['companyProfile']);
    },
  });
}
