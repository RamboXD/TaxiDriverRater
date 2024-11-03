import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { PatchedTransactionUpdate } from 'types/generated';

export default function useUpdateTransaction(
  transactionId?: string,
): UseMutationResult<
  AxiosResponse<unknown>,
  AxiosError<{ details: string }>,
  Partial<PatchedTransactionUpdate>
> {
  const queryClient = useQueryClient();
  const client = useClient();

  const updateCompany = (payload: Partial<PatchedTransactionUpdate>) => {
    return client.patch(`transaction/${transactionId}/`, payload);
  };

  return useMutation(updateCompany, {
    onSuccess: () => {
      queryClient.invalidateQueries(['companyTransactions']);
      queryClient.invalidateQueries(['transactions']);
    },
  });
}
