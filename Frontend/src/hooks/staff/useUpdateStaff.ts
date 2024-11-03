import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import {
  Staff,
  // StaffUpdate
} from 'types/generated';

export default function useUpdateStaff(
  staffId?: string,
): UseMutationResult<
  AxiosResponse<Staff>,
  AxiosError<{ detail: string }>,
  any
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const updateStaff = (payload: any) => {
    return client.put(`/staffs/${staffId}/`, payload);
  };

  return useMutation(updateStaff, {
    onSuccess: () => {
      queryClient.invalidateQueries(['staffs']);
    },
  });
}
