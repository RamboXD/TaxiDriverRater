import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { GrossMarket, GrossMarketUpdate } from 'types/generated';

export default function useUpdateFarm(
  id: string | undefined
): UseMutationResult<
  AxiosResponse<GrossMarket>,
  AxiosError<{ message: string }>,
  GrossMarketUpdate
> {

  const client = useClient();
  const queryClient = useQueryClient();

  const updateFarm = () =>
    client.put(`farms/${id}/`);

  return useMutation(updateFarm, {
    onSuccess: () => {
      queryClient.invalidateQueries(['farms']);
    },
  });
}
