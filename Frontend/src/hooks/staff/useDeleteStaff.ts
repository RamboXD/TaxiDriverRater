import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

export default function useDeleteStaff(): UseMutationResult<
  AxiosResponse<void>,
  AxiosError<{ message: string }>,
  string
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const deleteStaff = (staffId: string) => {
    return client.delete(`/staffs/${staffId}/`);
  };

  return useMutation(deleteStaff, {
    onSuccess: () => {
      queryClient.invalidateQueries(['staffs']);
    },
  });
}
