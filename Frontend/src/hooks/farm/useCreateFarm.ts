import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { GrossMarket, GrossMarketCreate } from 'types/generated';

export default function useCreateFarm(): UseMutationResult<
  AxiosResponse<GrossMarket>,
  AxiosError<{ message: string }>,
  GrossMarketCreate
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const createFarm = (payload: GrossMarketCreate) => client.post('farms/', payload);

  return useMutation(createFarm, {
    onSuccess: () => {
      queryClient.invalidateQueries(['farms']);
    },
  });
}
