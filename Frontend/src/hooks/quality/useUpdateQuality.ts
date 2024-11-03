import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { Owner, QualityUpdate } from 'types/generated';

export default function useUpdateQuality(
  productId: string,
): UseMutationResult<
  AxiosResponse<Owner>,
  AxiosError<{ message: string }>,
  QualityUpdate
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const updateQuality = (payload: QualityUpdate) => {
    return client.put(`qualities/${productId}/`, payload);
  };

  return useMutation(updateQuality, {
    onSuccess: () => {
      queryClient.invalidateQueries(['sorts']);
    },
  });
}
