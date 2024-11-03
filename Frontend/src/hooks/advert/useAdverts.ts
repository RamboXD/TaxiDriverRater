import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { UrlParams } from 'types';
import { PaginatedAdvertList } from 'types/generated';

export default function useAdverts({
  search,
  quality,
  enabled = true,
}: {
  search?: string;
  quality?: string;
  enabled?: boolean;
}): UseQueryResult<
  AxiosResponse<PaginatedAdvertList>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const fetchAdverts = () => {
    const params: UrlParams = { limit: '20', offset: '0' };

    if (search) {
      params.search = search;
    }
    if (quality) {
      params.quality = quality;
    }

    return client.get(`adverts/`, { params });
  };

  return useQuery(['adverts', enabled, search, quality], fetchAdverts, {
    enabled,
    retry: false,
    getNextPageParam: (page) => {
      return page.data.next ? page.data.next : undefined;
    },
    getPreviousPageParam: (page) => {
      return page.data.previous ? page.data.previous : undefined;
    },
  });
}
