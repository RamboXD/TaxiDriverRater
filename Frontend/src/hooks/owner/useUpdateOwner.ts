import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { Owner, OwnerUpdate } from 'types/generated';

export default function useUpdateOwner(
  ownerId: string,
): UseMutationResult<
  AxiosResponse<Owner>,
  AxiosError<{ message: string }>,
  OwnerUpdate
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const updateOwner = (payload: OwnerUpdate) => {
    return client.put(`owners/${ownerId}/`, payload);
  };

  return useMutation(updateOwner, {
    onSuccess: () => {
      queryClient.invalidateQueries(['ownerProfile']);
    },
  });
}
