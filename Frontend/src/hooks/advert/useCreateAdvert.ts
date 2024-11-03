import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { Advert, AdvertCreate } from 'types/generated';

export default function useCreateAdvert(): UseMutationResult<
  AxiosResponse<Advert>,
  AxiosError<{ message: string }>,
  AdvertCreate
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const createAdvert = (payload: AdvertCreate) => {
    return client.post('advert/', payload);
  };

  return useMutation(createAdvert, {
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });
}
