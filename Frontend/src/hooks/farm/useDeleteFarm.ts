import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

export default function useDeleteFarm(): UseMutationResult<
  AxiosResponse<void>,
  AxiosError<{ message: string }>,
  string
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const deleteFarm = (farmId: string) => client.delete(`farms/${farmId}/`);

  return useMutation(deleteFarm, {
    onSuccess: () => {
      queryClient.invalidateQueries(['farms']);
    },
  });
}
