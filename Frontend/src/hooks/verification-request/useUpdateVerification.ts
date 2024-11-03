import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
// import { VerificationRequest } from 'types/generated';

export default function useUpdateVerification(): UseMutationResult<
  AxiosResponse<any>,
  AxiosError<{ detail: string }>,
  any
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const updateVerification = (payload: any) => {
    return client.patch(`/verification-requests/`, { status: payload });
  };

  return useMutation(updateVerification, {
    onSuccess: () => {
      queryClient.invalidateQueries(['verificationRequest']);
    },
  });
}
