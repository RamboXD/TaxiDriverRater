import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
// import { StaffCreate } from 'types/generated';

export default function useCreateStaff(): UseMutationResult<
  AxiosResponse<void>,
  AxiosError<{ detail: string }>,
  any
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const createStaff = (payload: any) => {
    return client.post('staffs/', payload);
  };

  return useMutation(createStaff, {
    onSuccess: () => {
      queryClient.invalidateQueries(['staffs']);
    },
  });
}
