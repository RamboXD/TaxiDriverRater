import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseQueryResult, useQuery } from 'react-query';
import { GmOwnerProfile } from 'types/generated';

export default function useFarmerProfile({
  enabled,
}: {
  enabled: boolean;
}): UseQueryResult<
  AxiosResponse<GmOwnerProfile>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const getFarmerProfile = () => {
    return client.get(`gm-owners/profile/`);
  };

  return useQuery(['farmerProfile', enabled], getFarmerProfile, {
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
