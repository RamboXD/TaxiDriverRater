import { AxiosError, AxiosResponse } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { CompanyWithUsersResponse } from 'types/profileTypes';
import { useClient } from 'contexts/AuthContext';

export default function useCompanyWithWorkers(
  companyId: string | undefined,
): UseQueryResult<AxiosResponse<CompanyWithUsersResponse>, AxiosError> {
  const client = useClient();

  const fetchCompanyWithWorkers = () => client.get(`/auth/company`);

  return useQuery(['companyWithWorkers', companyId], fetchCompanyWithWorkers, {
    enabled: !!companyId,
    refetchOnWindowFocus: false,
  });
}
