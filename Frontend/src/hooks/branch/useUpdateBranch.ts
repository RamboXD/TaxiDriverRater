import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { Branch } from 'types/generated';

export default function useUpdateBranch(
  branchId?: string,
): UseMutationResult<
  AxiosResponse<Branch>,
  AxiosError<{ message: string }>,
  any
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const updateBranch = (payload: any) => {
    return client.put(`branches/${branchId}/`, payload);
  };

  return useMutation(updateBranch, {
    onSuccess: () => {
      queryClient.invalidateQueries(['branches']);
    },
  });
}
