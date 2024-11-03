import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { BranchCreate } from 'types/generated';

export default function useCreateBranch(): UseMutationResult<
  AxiosResponse<void>,
  AxiosError<{ message: string }>,
  BranchCreate
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const createBranch = (payload: BranchCreate) => {
    return client.post('branch/', payload);
  };

  return useMutation(createBranch, {
    onSuccess: () => {
      queryClient.invalidateQueries(['branches']);
    },
  });
}
