import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { GmOwner, GmOwnerUpdate } from 'types/generated';

export default function useUpdateFarmer(
  farmerId: string,
): UseMutationResult<
  AxiosResponse<GmOwner>,
  AxiosError<{ message: string }>,
  GmOwnerUpdate
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const updateFarmer = (payload: GmOwnerUpdate) => {
    return client.put(`gm-owners/${farmerId}/`, payload);
  };

  return useMutation(updateFarmer, {
    onSuccess: () => {
      queryClient.invalidateQueries(['farmerProfile']);
    },
  });
}
