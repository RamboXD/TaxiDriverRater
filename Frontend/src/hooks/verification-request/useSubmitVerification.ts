import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

export default function useSubmitVerification(): UseMutationResult<
  AxiosResponse<void>,
  AxiosError<{ error: string }>,
  null
> {
  const queryClient = useQueryClient();
  const client = useClient();

  const submitVerification = () => {
    return client.post('verification-requests/');
  };

  return useMutation(submitVerification, {
    onSuccess: () => {
      queryClient.invalidateQueries(['verificationRequest']);
    },
  });
}
