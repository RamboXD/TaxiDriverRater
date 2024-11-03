import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { PaginatedQualityList } from 'types/generated';

import { UrlParams } from '../../types';

export default function useAutoCompleteQualities({
  sortId,
  search,
  exists,
}: {
  sortId?: string;
  search?: string;
  exists?: boolean;
}): UseQueryResult<
  AxiosResponse<PaginatedQualityList>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const fetchQualities = () => {
    const params: UrlParams = { limit: '100', offset: '0' };

    if (sortId) {
      params.sort_id = sortId;
    }
    if (search) {
      params.search = search;
    }
    if (exists !== undefined) {
      params.exists = exists ? 'True' : 'False';
    }

    return client.get(`qualities/`, {
      params,
    });
  };

  return useQuery(
    ['productQualities', sortId, search, exists],
    fetchQualities,
    {
      enabled: !!sortId,
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );
}
