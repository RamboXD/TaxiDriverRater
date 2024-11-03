import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { Advert, QualityUpdate } from 'types/generated';

export default function useUpdateAdvert(
  advertId?: string,
): UseMutationResult<
  AxiosResponse<Advert>,
  AxiosError<{ message: string }>,
  QualityUpdate
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const updateAdvert = (payload: QualityUpdate) => {
    return client.put(`advert/${advertId}/`, payload);
  };

  return useMutation(updateAdvert, {
    onSuccess: () => {
      queryClient.invalidateQueries(['products', advertId]);
    },
  });
}
