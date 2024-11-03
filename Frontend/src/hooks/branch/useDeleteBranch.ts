import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

export default function useDeleteBranch(): UseMutationResult<
  AxiosResponse<void>,
  AxiosError<{ message: string }>,
  string
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const deleteBranch = (branchId: string) => {
    return client.delete(`branches/${branchId}/`);
  };

  return useMutation(deleteBranch, {
    onSuccess: () => {
      queryClient.invalidateQueries(['branches']);
    },
  });
}
