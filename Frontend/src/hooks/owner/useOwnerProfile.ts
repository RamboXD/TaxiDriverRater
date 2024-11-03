import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { OwnerProfile } from 'types/generated';

export default function useOwnerProfile({
  enabled,
}: {
  enabled: boolean;
}): UseQueryResult<
  AxiosResponse<OwnerProfile>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const getOwnerProfile = () => {
    return client.get(`owners/profile/`);
  };

  return useQuery(['ownerProfile', enabled], getOwnerProfile, {
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
