import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { GrossMarketCreate } from 'types/generated';

export default function useCreateFarmer(): UseMutationResult<
  AxiosResponse<void>,
  AxiosError<{ message: string }>,
  GrossMarketCreate
> {
  const queryClient = useQueryClient();
  const client = useClient();

  const createCompany = (payload: GrossMarketCreate) => {
    return client.post('gross-markets/', payload);
  };

  return useMutation(createCompany, {
    onSuccess: () => {
      queryClient.invalidateQueries(['farmerProfile']);
    },
  });
}
