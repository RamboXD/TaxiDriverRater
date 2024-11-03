import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { UrlParams } from 'types';
import { PaginatedTransactionList } from 'types/generated';

export default function useTransactions({
  search,
  ordering,
  completed,
}: {
  search?: string;
  ordering?: string;
  completed: boolean;
}): UseQueryResult<
  AxiosResponse<PaginatedTransactionList>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const fetchAdverts = () => {
    const params: UrlParams = { limit: '20', offset: '0' };

    if (search) {
      params.search = search;
    }
    if (ordering) {
      params.ordering = ordering;
    }
    params.completed = completed ? 'true' : 'false';

    return client.get(`transactions/`, { params });
  };

  return useQuery(['transactions', search, ordering, completed], fetchAdverts, {
    retry: false,
    getNextPageParam: (page) => {
      return page.data.next ? page.data.next : undefined;
    },
    getPreviousPageParam: (page) => {
      return page.data.previous ? page.data.previous : undefined;
    },
  });
}
