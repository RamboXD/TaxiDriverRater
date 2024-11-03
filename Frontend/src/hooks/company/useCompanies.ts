// hooks/company/useCompanies.ts
import { AxiosError, AxiosResponse } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { CompanyProfile } from 'types/profileTypes';
import { useClient } from 'contexts/AuthContext';

export default function useCompanies(): UseQueryResult<
  AxiosResponse<{ companies: CompanyProfile[] }>,
  AxiosError
> {
  const client = useClient();

  const fetchCompanies = () => client.get('auth/companies');

  return useQuery(['companies'], fetchCompanies, {
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
