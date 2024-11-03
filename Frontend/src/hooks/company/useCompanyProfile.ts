import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { CompanyProfile } from 'types/generated';

export default function useCompanyProfile({
  enabled,
}: {
  enabled: boolean;
}): UseQueryResult<
  AxiosResponse<CompanyProfile>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const getFarmerProfile = () => {
    return client.get(`companies/profile/`);
  };

  return useQuery(['companyProfile', enabled], getFarmerProfile, {
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
