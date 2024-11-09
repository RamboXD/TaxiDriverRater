import { AxiosError, AxiosResponse } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { CompanyWithUsersResponse } from 'types/profileTypes';
import { useClient } from 'contexts/AuthContext';

export default function useCompany(
  companyId: string | undefined,
): UseQueryResult<AxiosResponse<CompanyWithUsersResponse>, AxiosError> {
  const client = useClient();

  const fetchCompany = () => client.get(`/auth/company`);

  return useQuery(['companyWithWorkers', companyId], fetchCompany, {
    enabled: !!companyId,
    refetchOnWindowFocus: false,
  });
}
