import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

export default function useCreateVerification(): UseMutationResult<
  AxiosResponse<void>,
  AxiosError<{ error: string }>,
  null
> {
  const queryClient = useQueryClient();
  const client = useClient();

  const createVerification = () => {
    return client.post('verification-requests/');
  };

  return useMutation(createVerification, {
    onSuccess: () => {
      queryClient.invalidateQueries(['verificationRequest']);
    },
  });
}
