import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

export default function useDeleteDocument(): UseMutationResult<
  AxiosResponse<void>,
  AxiosError<{ message: string }>,
  string
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const deleteDocument = (documentId: string) => {
    return client.delete(`documents/${documentId}/`);
  };

  return useMutation(deleteDocument, {
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
    },
  });
}
