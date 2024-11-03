import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { Branch } from 'types/generated';

export default function useBranch({
  branchId,
}: {
  branchId?: string;
}): UseQueryResult<AxiosResponse<Branch>, AxiosError<{ message: string }>> {
  const client = useClient();

  const fetchBranch = () => {
    return client.get(`branches/${branchId}/`);
  };

  return useQuery(['branches', branchId], fetchBranch, {
    enabled: !!branchId,
  });
}
