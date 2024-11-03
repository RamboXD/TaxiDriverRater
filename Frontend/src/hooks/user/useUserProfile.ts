import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseQueryResult, useQuery } from 'react-query';
import { UserProfile } from 'types/profileTypes';
import { clearTokens } from 'utils/storage-helper';

export default function useUserProfile({
  enabled,
}: {
  enabled: boolean;
}): UseQueryResult<AxiosResponse<UserProfile>, AxiosError<{ error: string }>> {
  const client = useClient();

  const getUserProfile = () => {
    return client.get(`auth/profile`);
  };

  return useQuery(['userProfile', enabled], getUserProfile, {
    enabled,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: () => {
      clearTokens();
    },
  });
}
