import { AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { UrlParams } from 'types';
import { PaginatedBranchList } from 'types/generated';

export default function useAutoCompleteBranch({
  search,
}: {
  search?: string;
}): UseQueryResult<AxiosResponse<PaginatedBranchList>> {
  const client = useClient();

  const fetchAutocompleteBranches = (): Promise<
    AxiosResponse<PaginatedBranchList>
  > => {
    const params: UrlParams = { limit: '100', offset: '0' };

    if (search) {
      params.search = search;
    }

    return client.get(`branches/`, { params });
  };

  return useQuery(['branchsAutocomplete', search], fetchAutocompleteBranches);
}
