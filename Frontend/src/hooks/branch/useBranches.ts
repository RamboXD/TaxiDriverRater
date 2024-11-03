import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { UrlParams } from 'types';
import { PaginatedBranchList } from 'types/generated';

export default function useBranches({
  search,
}: {
  search?: string;
}): UseQueryResult<
  AxiosResponse<PaginatedBranchList>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const getBranches = () => {
    const params: UrlParams = { limit: '20', offset: '0' };

    if (search) {
      params.search = search;
    }

    return client.get(`branches/`, { params });
  };

  return useQuery(['branches', search], getBranches, {
    retry: false,
    getNextPageParam: (page) => {
      return page.data.next ? page.data.next : undefined;
    },
    getPreviousPageParam: (page) => {
      return page.data.previous ? page.data.previous : undefined;
    },
  });
}
