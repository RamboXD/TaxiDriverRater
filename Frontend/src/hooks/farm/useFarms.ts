import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseQueryResult, useQuery } from 'react-query';
import { PaginatedGrossMarketList } from 'types/generated';

import { UrlParams } from '../../types';

export default function useFarms({
  search,
}: {
  search?: string;
}): UseQueryResult<
  AxiosResponse<PaginatedGrossMarketList>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const fetchFarms = () => {
    const params: UrlParams = { limit: '20', offset: '0' };

    if (search) {
      params.search = search;
    }

    return client.get(`farms/`, { params });
  };

  return useQuery(['farms', search], fetchFarms, {
    retry: false,
    getNextPageParam: (page) => {
      return page.data.next ? page.data.next : undefined;
    },
    getPreviousPageParam: (page) => {
      return page.data.previous ? page.data.previous : undefined;
    },
  });
}
