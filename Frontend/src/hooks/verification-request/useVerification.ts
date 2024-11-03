import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
// import { VerificationRequest } from 'types/generated';

export default function useVerificationRequest(): UseQueryResult<
  AxiosResponse<any>,
  AxiosError<{ error: string }>
> {
  const client = useClient();

  const getVerificationRequest = () => client.get(`verification-requests/`);

  return useQuery(['verificationRequest'], getVerificationRequest);
}
