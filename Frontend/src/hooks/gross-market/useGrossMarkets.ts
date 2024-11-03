import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { UrlParams } from 'types';
import { PaginatedGrossMarketList } from 'types/generated';

export default function useGrossMarkets({
  search,
  ordering,
}: {
  search?: string;
  ordering?: string;
}): UseQueryResult<
  AxiosResponse<PaginatedGrossMarketList>,
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

    return client.get(`gross-markets/`, { params });
  };

  return useQuery(['grossMarkets', search, ordering], fetchAdverts, {
    retry: false,
    getNextPageParam: (page) => {
      return page.data.next ? page.data.next : undefined;
    },
    getPreviousPageParam: (page) => {
      return page.data.previous ? page.data.previous : undefined;
    },
  });
}
