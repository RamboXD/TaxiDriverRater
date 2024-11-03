import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';

export default function useDeleteAdvert(): UseMutationResult<
  AxiosResponse<void>,
  AxiosError<{ message: string }>,
  string
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const deleteAdvert = (advertId: string) => {
    return client.delete(`adverts/${advertId}/`);
  };

  return useMutation(deleteAdvert, {
    onSuccess: () => {
      queryClient.invalidateQueries(['sorts']);
    },
  });
}
